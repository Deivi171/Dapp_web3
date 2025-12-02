import React, { useMemo } from 'react';
import { formatUSD, formatETH } from '../../utils/formatters';

const StatCard = ({ title, value, subtitle, theme, className = '' }) => (
    <div className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
        theme === 'dark' 
            ? 'bg-white/5 border border-white/10 hover:border-white/20' 
            : 'bg-white/50 backdrop-blur-md border border-white/40 hover:border-white/60 shadow-lg'
    } ${className}`}>
        <p className={`text-xs uppercase tracking-wide ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>{title}</p>
        <p className={`text-2xl font-bold mt-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>{value}</p>
        {subtitle && (
            <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>{subtitle}</p>
        )}
    </div>
);

const Stats = ({ transactions, currentAccount, ethPrice, theme }) => {
    const stats = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return {
                totalTransactions: 0,
                totalVolume: 0,
                totalVolumeUSD: 0,
                sent: 0,
                received: 0,
                avgAmount: 0,
            };
        }

        const accountLower = currentAccount?.toLowerCase();
        
        let totalVolume = 0;
        let sent = 0;
        let received = 0;

        transactions.forEach(tx => {
            const amount = parseFloat(tx.amount) || 0;
            totalVolume += amount;
            
            if (tx.addressFrom?.toLowerCase() === accountLower) {
                sent++;
            }
            if (tx.addressTo?.toLowerCase() === accountLower) {
                received++;
            }
        });

        return {
            totalTransactions: transactions.length,
            totalVolume,
            totalVolumeUSD: totalVolume * (ethPrice || 0),
            sent,
            received,
            avgAmount: transactions.length > 0 ? totalVolume / transactions.length : 0,
        };
    }, [transactions, currentAccount, ethPrice]);

    return (
        <div className="w-full max-w-4xl mx-auto my-6 animate-fadeInUp">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Transactions"
                    value={stats.totalTransactions}
                    theme={theme}
                />
                <StatCard
                    title="Total Volume"
                    value={formatETH(stats.totalVolume, 4)}
                    subtitle={ethPrice > 0 ? formatUSD(stats.totalVolumeUSD) : null}
                    theme={theme}
                />
                <StatCard
                    title="Sent"
                    value={stats.sent}
                    subtitle="transactions"
                    theme={theme}
                />
                <StatCard
                    title="Received"
                    value={stats.received}
                    subtitle="transactions"
                    theme={theme}
                />
            </div>
        </div>
    );
};

export default Stats;
