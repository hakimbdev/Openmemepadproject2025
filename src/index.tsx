// Include Telegram UI styles first to allow our code override the package CSS.
import '@telegram-apps/telegram-ui/dist/styles.css';

import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { Root } from '@/components/Root.tsx';
import { EnvUnsupported } from '@/components/EnvUnsupported.tsx';
import { VersionCompatibility } from '@/components/VersionCompatibility.tsx';
import { init } from '@/init.ts';

import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform, tgWebAppVersion: version } = launchParams;
  const debug = (launchParams.tgWebAppStartParam || '').includes('platformer_debug')
    || import.meta.env.DEV;

  // Check for version compatibility
  const versionNumber = parseFloat(version || '0');
  const isVersionCompatible = versionNumber >= 7.0 || import.meta.env.DEV;

  if (!isVersionCompatible) {
    root.render(
      <StrictMode>
        <VersionCompatibility />
      </StrictMode>,
    );
  } else {
    // Configure all application dependencies.
    await init({
      debug,
      eruda: debug && ['ios', 'android'].includes(platform),
      mockForMacOS: platform === 'macos',
    })
      .then(() => {
        root.render(
          <StrictMode>
            <Root/>
          </StrictMode>,
        );
      });
  }
} catch (e) {
  console.error('App initialization error:', e);
  
  // Check if it's a version compatibility error
  if (e instanceof Error && e.message.includes('too old')) {
    root.render(
      <StrictMode>
        <VersionCompatibility />
      </StrictMode>,
    );
  } else {
    root.render(<EnvUnsupported/>);
  }
}
