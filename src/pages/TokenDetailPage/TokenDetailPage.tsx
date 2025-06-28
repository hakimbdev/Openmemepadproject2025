import { FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Cell,
  List,
  Progress,
  Section,
  Text,
  Title,
} from '@telegram-apps/telegram-ui';
import { useTonWallet } from '@tonconnect/ui-react';
import { Page } from '@/components/Page.tsx';
import { bem } from '@/css/bem.ts';
import { supabase } from '@/helpers/supabaseClient';

import './TokenDetailPage.css';

const [block, element] = bem('token-detail-page');

interface TokenDetail {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: number;
  marketCap: string;
  change24h: number;
  launchStatus: 'upcoming' | 'live' | 'ended';
  progress?: number;
  description: string;
  tokenAddress: string;
  totalSupply: string;
  website: string;
  telegram: string;
  twitter: string;
}

export const TokenDetailPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = useTonWallet();
  const [token, setToken] = useState<TokenDetail | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get token ID from URL
  const tokenId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    async function fetchToken() {
      setIsLoading(true);
      setError(null);
      if (tokenId) {
        const { data, error } = await supabase
          .from('tokens')
          .select('*')
          .eq('id', tokenId)
          .single();
        if (error || !data) {
          setToken(null);
          setError('Failed to load token details. Please try again later.');
        } else {
          setToken({
            id: data.id,
            name: data.name,
            symbol: data.symbol,
            iconUrl: data.logo_url,
            price: data.price_usd,
            marketCap: data.market_cap,
            change24h: data.price_change_24h,
            launchStatus: data.is_active ? 'live' : 'upcoming',
            progress: 100, // You can calculate this based on your logic
            description: data.description,
            tokenAddress: data.contract_address,
            totalSupply: data.total_supply,
            website: data.website,
            telegram: data.telegram,
            twitter: data.twitter,
          });
        }
      }
      setIsLoading(false);
    }
    fetchToken();
  }, [tokenId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const calculateTokenAmount = () => {
    if (!amount || !token) return '0';
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return '0';
    
    const tokenAmount = amountNum / token.price;
    return tokenAmount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const handleBuy = async () => {
    if (!wallet || !token || !amount) return;
    
    setIsLoading(true);
    
    try {
      // This is a placeholder for actual TON transaction
      // In a real app, you would:
      // 1. Create a transaction
      // 2. Send it to the user's wallet
      // 3. Wait for confirmation
      
      console.log(`Buying ${calculateTokenAmount()} ${token.symbol} for ${amount} TON`);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      alert(`Successfully purchased ${calculateTokenAmount()} ${token.symbol}!`);
      setAmount('');
    } catch (error) {
      console.error('Error buying token:', error);
      alert('Failed to purchase token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Page>
        <div className={block()}>
          <div className={element('header')}>
            <button onClick={handleBack}>Back</button>
            <Title level="2">Token Detail</Title>
          </div>
          <div className={block('loading')}>
            <Text>Loading token details...</Text>
          </div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <div className={block()}>
          <div className={element('header')}>
            <button onClick={handleBack}>Back</button>
            <Title level="2">Token Detail</Title>
          </div>
          <div className={block('error')}>
            <Text>{error}</Text>
          </div>
        </div>
      </Page>
    );
  }

  if (!token) {
    return (
      <Page>
        <div className={block()}>
          <div className={element('header')}>
            <button onClick={handleBack}>Back</button>
            <Title level="2">Token Detail</Title>
          </div>
          <div className={block('empty')}>
            <Text>Token not found.</Text>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className={block()}>
        <div className={element('header')}>
          <button onClick={handleBack}>Back</button>
          <Title level="2">Token Detail</Title>
        </div>
        
        <div className={element('token-header')}>
          <Avatar src={token.iconUrl} alt={`${token.name} logo`} width={64} height={64} />
          <div className={element('header-info')}>
            <Title level="3">{token.name}</Title>
            <Text>{token.symbol}</Text>
          </div>
          <div className={element('price-info')}>
            <Text className={element('price')}>${token.price.toFixed(6)}</Text>
            <Text className={`${element('change')} ${token.change24h >= 0 ? element('positive') : element('negative')}`}>
              {token.change24h >= 0 ? '+' : ''}{token.change24h}%
            </Text>
          </div>
        </div>

        {token.progress !== undefined && (
          <div className={element('progress-section')}>
            <Progress value={token.progress} />
            <div className={element('progress-info')}>
              <Text>{token.progress}% Filled</Text>
              <Text className={element('market-cap')}>{token.marketCap}</Text>
            </div>
          </div>
        )}

        <List>
          <Section header="About">
            <Cell multiline>
              <Text>{token.description}</Text>
            </Cell>
          </Section>

          <Section header="Token Info">
            <Cell title="Contract Address" multiline>
              <Text className={element('address')}>{token.tokenAddress}</Text>
            </Cell>
            <Cell title="Total Supply">
              <Text>{token.totalSupply}</Text>
            </Cell>
            <Cell title="Launch Status">
              <Text className={element('status')}>{token.launchStatus.charAt(0).toUpperCase() + token.launchStatus.slice(1)}</Text>
            </Cell>
          </Section>

          <Section header="Links">
            <Cell title="Website">
              <Text className={element('link')}>{token.website}</Text>
            </Cell>
            <Cell title="Telegram">
              <Text className={element('link')}>{token.telegram}</Text>
            </Cell>
            <Cell title="Twitter">
              <Text className={element('link')}>{token.twitter}</Text>
            </Cell>
          </Section>

          {token.launchStatus === 'live' && (
            <Section header="Buy Token">
              <div className={element('buy-form')}>
                <div className={element('input-group')}>
                  <label className={element('input-label')}>Amount (TON)</label>
                  <input
                    type="text"
                    className={element('input')}
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.0"
                  />
                </div>
                
                <div className={element('token-amount')}>
                  <Text>You will receive: {calculateTokenAmount()} {token.symbol}</Text>
                </div>
                
                <Button
                  className={element('buy-button')}
                  onClick={handleBuy}
                  loading={isLoading}
                  disabled={!amount || parseFloat(amount) <= 0 || !wallet}
                >
                  {wallet ? 'Buy Token' : 'Connect Wallet to Buy'}
                </Button>
              </div>
            </Section>
          )}
        </List>
      </div>
    </Page>
  );
}; 