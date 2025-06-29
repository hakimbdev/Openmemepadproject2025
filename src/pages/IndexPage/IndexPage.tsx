import { Section, Cell, Image, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';

import tonSvg from './ton.svg';

export const IndexPage: FC = () => {
  return (
    <Page back={false}>
      <List style={{ background: '#fff', color: '#222' }}>
        <Section
          header={<span style={{ color: '#2563eb' }}>Meme Token Platform</span>}
          footer={<span style={{ color: '#2563eb' }}>Launch your own meme tokens on the TON blockchain or trade existing tokens</span>}
          style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(30,64,175,0.08)', marginBottom: 16 }}
        >
          <Link to="/">
            <Cell
              subtitle={<span style={{ color: '#2563eb' }}>Discover and trade meme tokens</span>}
              style={{ color: '#222' }}
            >
              Open MemePad
            </Cell>
          </Link>
          <Link to="/my-tokens">
            <Cell
              subtitle={<span style={{ color: '#2563eb' }}>View your tokens</span>}
              style={{ color: '#222' }}
            >
              My Tokens
            </Cell>
          </Link>
          <Link to="/create-token">
            <Cell
              subtitle={<span style={{ color: '#2563eb' }}>Launch your own meme token</span>}
              style={{ color: '#222' }}
            >
              Create Token
            </Cell>
          </Link>
        </Section>
        
        <Section
          header={<span style={{ color: '#2563eb' }}>Features</span>}
          footer={<span style={{ color: '#2563eb' }}>You can use these pages to learn more about features, provided by Telegram Mini Apps and other useful projects</span>}
          style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(30,64,175,0.08)', marginBottom: 16 }}
        >
          <Link to="/ton-connect">
            <Cell
              before={<Image src={tonSvg} style={{ backgroundColor: '#2563eb' }}/>} 
              subtitle={<span style={{ color: '#2563eb' }}>Connect your TON wallet</span>}
              style={{ color: '#222' }}
            >
              TON Connect
            </Cell>
          </Link>
        </Section>
        
        <Section
          header={<span style={{ color: '#2563eb' }}>Application Launch Data</span>}
          footer={<span style={{ color: '#2563eb' }}>These pages help developer to learn more about current launch information</span>}
          style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(30,64,175,0.08)' }}
        >
          <Link to="/init-data">
            <Cell subtitle={<span style={{ color: '#2563eb' }}>User data, chat information, technical data</span>} style={{ color: '#222' }}>Init Data</Cell>
          </Link>
          <Link to="/launch-params">
            <Cell subtitle={<span style={{ color: '#2563eb' }}>Platform identifier, Mini Apps version, etc.</span>} style={{ color: '#222' }}>Launch Parameters</Cell>
          </Link>
          <Link to="/theme-params">
            <Cell subtitle={<span style={{ color: '#2563eb' }}>Telegram application palette information</span>} style={{ color: '#222' }}>Theme Parameters</Cell>
          </Link>
        </Section>
      </List>
    </Page>
  );
};
