import { FC, useState, useEffect } from 'react';
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
import { memepadLogo } from '@/assets/images/index';
import { supabase } from '@/helpers/supabaseClient';

import './MemePadPage.css';

const [block, element] = bem('meme-pad-page');

interface Token {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: number;
  marketCap: string;
  change24h: number;
  launchStatus: 'upcoming' | 'live' | 'recentlyAdded';
  progress?: number;
  owned?: number;
}

export const MemePadPage: FC = () => {
  const wallet = useTonWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recentlyAdded'>('live');
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tokens from Supabase
  useEffect(() => {
    async function fetchTokens() {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('is_active', true);
      if (error) {
        console.error('Error fetching tokens:', error);
        setTokens([]);
        setError('Failed to load tokens. Please try again later.');
      } else {
        setTokens(data || []);
      }
      setIsLoading(false);
    }
    fetchTokens();
  }, []);

  const filteredTokens = tokens.filter(token => 
    (token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     token.symbol.toLowerCase().includes(searchQuery.toLowerCase())) &&
    token.launchStatus === activeTab
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (tab: 'live' | 'upcoming' | 'recentlyAdded') => {
    setActiveTab(tab);
  };

  const handleBuyToken = async (tokenId: string) => {
    // Check if wallet is connected before buying
    if (!wallet) {
      alert('Please connect your wallet to buy tokens');
      return;
    }

    try {
      setTransactionInProgress(true);
      
      // Simulate API call to buy token
      console.log(`Buying token with ID: ${tokenId}`);
      
      // In a real app, this would be a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully bought token! Transaction hash: TX${Math.random().toString(16).slice(2, 10)}`);
      
      // Update token state to reflect ownership
      setTokens(prevTokens => 
        prevTokens.map(token => 
          token.id === tokenId 
            ? { 
                ...token, 
                owned: (token.owned || 0) + 1000 
              } 
            : token
        )
      );
    } catch (error) {
      console.error('Error buying token:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleSellToken = async (tokenId: string) => {
    // Check if wallet is connected before selling
    if (!wallet) {
      alert('Please connect your wallet to sell tokens');
      return;
    }

    const token = tokens.find(t => t.id === tokenId);
    
    if (!token || !token.owned || token.owned <= 0) {
      alert('You don\'t own any of these tokens to sell');
      return;
    }

    try {
      setTransactionInProgress(true);
      
      // Simulate API call to sell token
      console.log(`Selling token with ID: ${tokenId}`);
      
      // In a real app, this would be a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully sold token! Transaction hash: TX${Math.random().toString(16).slice(2, 10)}`);
      
      // Update token state to reflect reduced ownership
      setTokens(prevTokens => 
        prevTokens.map(token => 
          token.id === tokenId 
            ? { 
                ...token, 
                owned: Math.max(0, (token.owned || 0) - 1000)
              } 
            : token
        )
      );
    } catch (error) {
      console.error('Error selling token:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handleTokenDetails = (tokenId: string) => {
    console.log(`View details for token with ID: ${tokenId}`);
    // In a real app, this would navigate to a token details page
  };

  return (
    <Page>
      <div className={block()}>
        <div className={element('header')}>
          <div className={element('brand')}>
            <img src={memepadLogo} alt="Open MemePad Logo" className={element('logo')} />
            <div className={element('brand-text')}>
              <Title level="2">Open MemePad</Title>
              <Text className={element('slogan')}>
                Powering Token Launches on TON Blockchain!
              </Text>
            </div>
          </div>
        </div>
        
        <div className={element('tabs')}>
          <button 
            className={`${element('tab')} ${activeTab === 'live' ? element('tab-active') : ''}`} 
            onClick={() => handleTabChange('live')}
          >
            Live
          </button>
          <button 
            className={`${element('tab')} ${activeTab === 'upcoming' ? element('tab-active') : ''}`} 
            onClick={() => handleTabChange('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`${element('tab')} ${activeTab === 'recentlyAdded' ? element('tab-active') : ''}`} 
            onClick={() => handleTabChange('recentlyAdded')}
          >
            Recently Added
          </button>
        </div>

        <div className={element('search')}>
          <div className={element('search-container')}>
            <input
              type="text"
              className={element('search-input')}
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name or symbol"
            />
            <div className={element('search-icon')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 14L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={element('loading')}>
            <Text>Loading tokens...</Text>
          </div>
        ) : error ? (
          <div className={element('error')}>
            <Text>{error}</Text>
          </div>
        ) : (
          <List>
            {filteredTokens.length > 0 ? (
              filteredTokens.map(token => (
                <Section key={token.id} className={element('token-card')}>
                  <Cell
                    before={
                      <Avatar src={token.iconUrl} alt={`${token.name} logo`} width={48} height={48} />
                    }
                    subtitle={
                      <div className={element('token-info')}>
                        <Text>{token.symbol}</Text>
                        {token.owned && token.owned > 0 && (
                          <Text className={element('owned-amount')}>You own: {token.owned.toLocaleString()}</Text>
                        )}
                      </div>
                    }
                    after={
                      <div className={element('price-info')}>
                        <Text className={element('price')}>${token.price.toFixed(5)}</Text>
                        <Text className={`${element('change')} ${token.change24h >= 0 ? element('positive') : element('negative')}`}>
                          {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                        </Text>
                      </div>
                    }
                    onClick={() => handleTokenDetails(token.id)}
                  >
                    <Title level="3">{token.name}</Title>
                  </Cell>
                  {token.progress !== undefined && token.progress < 100 && (
                    <div className={element('progress-container')}>
                      <Progress value={token.progress} />
                      <Text className={element('progress-text')}>{token.progress}% Filled</Text>
                    </div>
                  )}
                  <div className={element('action-buttons')}>
                    <Button 
                      className={element('buy-button')}
                      onClick={() => handleBuyToken(token.id)}
                      loading={transactionInProgress}
                      disabled={transactionInProgress}
                    >
                      Buy
                    </Button>
                    {token.owned && token.owned > 0 ? (
                      <Button 
                        className={element('sell-button')}
                        onClick={() => handleSellToken(token.id)}
                        loading={transactionInProgress}
                        disabled={transactionInProgress}
                      >
                        Sell
                      </Button>
                    ) : (
                      <Button 
                        className={element('details-button')}
                        onClick={() => handleTokenDetails(token.id)}
                      >
                        Details
                      </Button>
                    )}
                  </div>
                </Section>
              ))
            ) : (
              <div className={element('empty-state')}>
                <Text>No tokens found</Text>
              </div>
            )}
          </List>
        )}
      </div>
    </Page>
  );
}; 