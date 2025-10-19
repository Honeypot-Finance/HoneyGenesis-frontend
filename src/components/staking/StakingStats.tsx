import { useState } from 'react';
import { useStakingParams } from '@/hooks/useNFTStaking';
import { formatTokenAmount, formatBps, calculateRewardsPerDay } from '@/lib/stakingUtils';

export function StakingStats() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { rewardRatePerSecond, burnBonusBps } = useStakingParams();

  return (
    <div className="staking-tabs-container" style={{ marginTop: '2rem' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
          fontFamily: '"inter black", sans-serif',
        }}
      >
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ffcd4d', margin: 0 }}>
          Staking Parameters
        </h2>
        <span style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s',
          color: '#ffcd4d',
          fontSize: '1.5rem',
        }}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div style={{ padding: '0 1rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {rewardRatePerSecond !== undefined && (
              <div className="info-section">
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#60A5FA' }}>
                  Base Rewards per Second
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60A5FA', margin: '0.5rem 0' }}>
                  {formatTokenAmount(rewardRatePerSecond, 18, 6)}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#999999' }}>
                  ≈ {calculateRewardsPerDay(rewardRatePerSecond)} per day (at 1x multiplier)
                </p>
              </div>
            )}

            {burnBonusBps !== undefined && (
              <div className="info-section" style={{ borderLeftColor: '#f7941d' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f7941d' }}>
                  Burn Bonus
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f7941d', margin: '0.5rem 0' }}>
                  +{formatBps(burnBonusBps)}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#999999' }}>
                  Additional rewards for burning your NFT
                </p>
              </div>
            )}

            <div className="info-section" style={{ borderLeftColor: '#A78BFA' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#A78BFA' }}>
                Multiplier System
              </p>
              <p style={{ fontSize: '0.75rem', color: '#999999', marginTop: '0.5rem' }}>
                Your rewards increase by 1x for every 30 days staked:
              </p>
              <ul style={{ fontSize: '0.75rem', color: '#999999', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>0-30 days: 1x multiplier</li>
                <li>30-60 days: 2x multiplier</li>
                <li>60-90 days: 3x multiplier</li>
                <li>And so on...</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
