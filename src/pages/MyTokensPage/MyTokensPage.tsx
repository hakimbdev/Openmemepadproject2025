import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Cell,
  List,
  Section,
  Text,
  Title,
} from '@telegram-apps/telegram-ui';
import { useTonWallet, TonConnectButton } from '@tonconnect/ui-react';
import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';
import { supabase } from '@/helpers/supabaseClient';

import './MyTokensPage.css';

const [block, element] = bem('my-tokens-page');

interface MyToken {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  amount: string;
  value: number;
  price: number;
  change24h: number;
}

export const MyTokensPage: FC = () => {
  const navigate = useNavigate();
  const wallet = useTonWallet();
  const [myTokens, setMyTokens] = useState<MyToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyTokens() {
      if (wallet && wallet.account?.address) {
        // Get the user by wallet address
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', wallet.account.address)
          .single();
        if (userError || !users) {
          setMyTokens([]);
          setError('Failed to load your tokens. Please try again later.');
          setIsLoading(false);
          return;
        }
        // Get portfolios for this user, join with tokens
        const { data, error } = await supabase
          .from('portfolios')
          .select('balance, token:tokens(*)')
          .eq('user_id', users.id);
        if (error) {
          setMyTokens([]);
          setError('Failed to load your tokens. Please try again later.');
        } else {
          setMyTokens(
            (data || []).map((row: any) => ({
              id: row.token.id,
              name: row.token.name,
              symbol: row.token.symbol,
              iconUrl: row.token.logo_url,
              amount: row.balance,
              value: (row.balance * (row.token.price_usd || 0)),
              price: row.token.price_usd,
              change24h: row.token.price_change_24h,
            }))
          );
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
    fetchMyTokens();
  }, [wallet]);

  const getTotalValue = () => {
    return myTokens.reduce((sum, token) => sum + token.value, 0);
  };

  const handleViewToken = (tokenId: string) => {
    navigate(`/token?id=${tokenId}`);
  };

  const handleCreateToken = () => {
    navigate('/create-token');
  };

  if (!wallet) {
    return (
      <Page>
        <div className={block()}>
          <div className={element('header')}>
            <Title level="2">My Tokens</Title>
          </div>
          <div className={element('placeholder')}>
            <Title level="3">Connect Wallet</Title>
            <Text>
              Connect your TON wallet to view your tokens
            </Text>
            <TonConnectButton className={element('connect-button')}/>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className={block()}>
        <div className={element('header')}>
          <Title level="2">My Tokens</Title>
          <Button onClick={() => navigate(-1)} style={{ borderRadius: 8, background: '#334155', color: '#fff', fontWeight: 600 }}>Back</Button>
        </div>
        
        {isLoading ? (
          <div className={element('loading')}>Loading your tokens...</div>
        ) : error ? (
          <div className={element('error')}>{error}</div>
        ) : (
          <>
            {myTokens.length > 0 ? (
              <>
                <div className={element('summary')}>
                  <Title level="3">Total Value</Title>
                  <div className={element('total-value')}>
                    <span className={element('value-amount')}>${getTotalValue().toFixed(2)}</span>
                    <span className={element('wallet-address')}>
                      {wallet.account?.address ? `${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-6)}` : 'Address not available'}
                    </span>
                  </div>
                </div>
                <div className={element('token-list')}>
                  {myTokens.map(token => (
                    <div key={token.id} className={element('token-card')}>
                      <img src={token.iconUrl} alt={token.symbol} className={element('token-icon')} />
                      <div className={element('token-info')}>
                        <div className={element('token-title')}>
                          {token.name} <span className={element('token-symbol')}>({token.symbol})</span>
                        </div>
                        <div className={element('token-meta')}>
                          <span>Amount: {token.amount}</span>
                          <span>Price: ${token.price}</span>
                          <span style={{ color: token.change24h >= 0 ? '#22c55e' : '#ef4444' }}>
                            24h: {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                          </span>
                        </div>
                        <div style={{ color: '#38bdf8', fontSize: 13, marginTop: 2 }}>
                          Value: ${token.value.toFixed(2)}
                        </div>
                      </div>
                      <div className={element('token-actions')}>
                        <button
                          className={element('details-btn')}
                          onClick={() => handleViewToken(token.id)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={element('empty-state')}>
                You don't own any tokens yet.<br />
                <button
                  className={element('details-btn')}
                  onClick={handleCreateToken}
                  style={{ marginTop: 16 }}
                >
                  Create Token
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  );
}; 