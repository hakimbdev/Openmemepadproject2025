import { FC, useState, useEffect } from 'react';
import {
   Progress,
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

// Mock data for fallback
const mockTokens: Token[] = [
  {
    id: '1',
    name: 'MemeCoin',
    symbol: 'MEME',
    iconUrl: 'https://via.placeholder.com/40',
    price: 0.001,
    marketCap: '$1.2M',
    change24h: 15.5,
    launchStatus: 'live',
  },
  {
    id: '2',
    name: 'DogeClone',
    symbol: 'DOGE2',
    iconUrl: 'https://via.placeholder.com/40',
    price: 0.0005,
    marketCap: '$800K',
    change24h: -5.2,
    launchStatus: 'live',
  },
  {
    id: '3',
    name: 'PepeToken',
    symbol: 'PEPE',
    iconUrl: 'https://via.placeholder.com/40',
    price: 0.002,
    marketCap: '$2.1M',
    change24h: 25.8,
    launchStatus: 'upcoming',
    progress: 75,
  },
];

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
      
      try {
        const { data, error } = await supabase
          .from('tokens')
          .select('*')
          .eq('is_active', true);
          
        if (error) {
          console.error('Error fetching tokens:', error);
          // Use mock data as fallback
          setTokens(mockTokens);
          setError('Using demo data. Database connection failed.');
        } else {
          setTokens(data && data.length > 0 ? data : mockTokens);
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
        // Use mock data as fallback
        setTokens(mockTokens);
        setError('Using demo data. Network connection failed.');
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

        {error && (
          <div className={element('error')}>
            {error}
          </div>
        )}

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
          <input
            type="text"
            placeholder="Search tokens by name or symbol..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className={element('token-list')}>
          {isLoading ? (
            <div className={element('empty-state')}>Loading tokens...</div>
          ) : filteredTokens.length === 0 ? (
            <div className={element('empty-state')}>No tokens found for this tab or search.</div>
          ) : (
            filteredTokens.map(token => (
              <div key={token.id} className={element('token-card')}>
                <img src={token.iconUrl} alt={token.symbol} className={element('token-icon')} />
                <div className={element('token-info')}>
                  <div className={element('token-title')}>
                    {token.name} <span className={element('token-symbol')}>({token.symbol})</span>
                  </div>
                  <div className={element('token-meta')}>
                    <span>Price: ${token.price}</span>
                    <span>Market Cap: {token.marketCap}</span>
                    <span style={{ color: token.change24h >= 0 ? '#22c55e' : '#ef4444' }}>
                      24h: {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                    </span>
                  </div>
                  {typeof token.owned === 'number' && token.owned > 0 && (
                    <div style={{ color: '#38bdf8', fontSize: 13, marginTop: 2 }}>
                      Owned: {token.owned}
                    </div>
                  )}
                  {token.progress && (
                    <div style={{ marginTop: 6 }}>
                      <Progress value={token.progress} style={{ height: 8, borderRadius: 6 }} />
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>Progress: {token.progress}%</span>
                    </div>
                  )}
                </div>
                <div className={element('token-actions')}>
                  <button
                    className={element('buy-btn')}
                    onClick={() => handleBuyToken(token.id)}
                    disabled={transactionInProgress}
                  >
                    Buy
                  </button>
                  <button
                    className={element('sell-btn')}
                    onClick={() => handleSellToken(token.id)}
                    disabled={transactionInProgress || !token.owned}
                  >
                    Sell
                  </button>
                  <button
                    className={element('details-btn')}
                    onClick={() => handleTokenDetails(token.id)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Page>
  );
}; 