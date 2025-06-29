import { FC } from 'react';
import { Page } from '@/components/Page.tsx';
import { Title, Text, Button } from '@telegram-apps/telegram-ui';

export const VersionCompatibility: FC = () => {
  const handleUpdateTelegram = () => {
    // Open Telegram app store or update page
    if (navigator.userAgent.includes('TelegramWebApp')) {
      // In Telegram Web App, we can't directly open app store
      alert('Please update your Telegram app to the latest version from your device\'s app store.');
    } else {
      // Open appropriate app store
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        window.open('https://apps.apple.com/app/telegram-messenger/id686449807', '_blank');
      } else if (isAndroid) {
        window.open('https://play.google.com/store/apps/details?id=org.telegram.messenger', '_blank');
      } else {
        window.open('https://telegram.org/apps', '_blank');
      }
    }
  };

  const handleContinueAnyway = () => {
    // Reload the page to try again
    window.location.reload();
  };

  return (
    <Page>
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱</div>
        
        <Title level="1" style={{ marginBottom: '16px' }}>
          Update Required
        </Title>
        
        <Text style={{ marginBottom: '24px', lineHeight: '1.5' }}>
          Your Telegram app version is too old to run this application. 
          Please update to the latest version to continue.
        </Text>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button 
            onClick={handleUpdateTelegram}
            size="l"
            style={{ marginBottom: '8px' }}
          >
            Update Telegram
          </Button>
          
          <Button 
            onClick={handleContinueAnyway}
            size="l"
            mode="outline"
          >
            Try Anyway
          </Button>
        </div>
        
        <Text style={{ 
          marginTop: '24px', 
          fontSize: '14px', 
          color: '#999',
          lineHeight: '1.4'
        }}>
          This app requires Telegram version 7.0 or higher. 
          You can download the latest version from your device's app store.
        </Text>
      </div>
    </Page>
  );
}; 