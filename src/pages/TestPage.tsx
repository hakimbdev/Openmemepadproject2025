import { FC } from 'react';
import { Page } from '@/components/Page.tsx';
import { Title, Text, Button } from '@telegram-apps/telegram-ui';

export const TestPage: FC = () => {
  return (
    <Page>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Title level="1">🚀 App is Working!</Title>
        <Text style={{ marginBottom: '20px' }}>
          If you can see this page, the basic app structure is loading correctly.
        </Text>
        <Button 
          onClick={() => alert('Button clicked! App is interactive.')}
          size="l"
        >
          Test Button
        </Button>
      </div>
    </Page>
  );
}; 