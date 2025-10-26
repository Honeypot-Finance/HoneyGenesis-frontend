import { useState } from 'react';
import { useStakingParams } from '@/hooks/useNFTStaking';
import { formatTokenAmount, formatBps, calculateRewardsPerDay } from '@/lib/stakingUtils';

export function StakingStats() {
  const { rewardRatePerSecond, burnBonusBps } = useStakingParams();

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem', width: '100%' }}>
      <h2
        className="stats-title"
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#C4B5A0',
          margin: '0 0 1.5rem 0',
        }}
      >
        Staking paramaters
      </h2>

      <div
        className="staking-params-grid"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '2rem',
          width: '100%',
        }}
      >
        {/* Base Rewards per Second */}
        {rewardRatePerSecond !== undefined && (
          <div>
            <p
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#F7A129',
                margin: '0 0 0.5rem 0',
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              {formatTokenAmount(rewardRatePerSecond, 18, 6)}
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#C4B5A0',
                margin: 0,
              }}
            >
              Base Rewards per Second{' '}
              <span
                style={{
                  fontSize: '1.2rem',
                  color: '#A08B6F',
                  cursor: 'help',
                }}
                title="Base rewards earned per second of staking at 1x multiplier"
              >
                ⓘ
              </span>
            </p>
          </div>
        )}

        {/* Burn Bonus */}
        {burnBonusBps !== undefined && (
          <div>
            <p
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#F7A129',
                margin: '0 0 0.5rem 0',
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              +{formatBps(burnBonusBps)}
            </p>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#C4B5A0',
                margin: 0,
              }}
            >
              Burn Bonus{' '}
              <span
                style={{
                  fontSize: '1.2rem',
                  color: '#A08B6F',
                  cursor: 'help',
                }}
                title="Additional rewards multiplier when you burn your NFT"
              >
                ⓘ
              </span>
            </p>
          </div>
        )}

        {/* Multiplier System */}
        <div>
          <p
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#F7A129',
              margin: '0 0 0.5rem 0',
              fontFamily: "'Clash Display', sans-serif",
            }}
          >
            1X for 30D
          </p>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#C4B5A0',
              margin: 0,
            }}
          >
            Multiplier System{' '}
            <span
              style={{
                fontSize: '1.2rem',
                color: '#A08B6F',
                cursor: 'help',
              }}
              title="Rewards multiply every 30 days: 1x (0-30d), 2x (30-60d), 3x (60-90d), and so on"
            >
              ⓘ
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
