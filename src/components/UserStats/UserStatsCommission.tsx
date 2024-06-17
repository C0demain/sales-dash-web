import React, { useEffect, useState } from "react";
import { Statistic, Spin } from "antd";
import { formatCurrency } from "util/formatters";
import './index.css'; 

const UserStatsCommission = ({ totalComissionProp }: { totalComissionProp: number }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const customIndicator = <div style={{ display: 'none' }} />;

    useEffect(() => {
        if (totalComissionProp !== undefined) {
            setLoading(false);
        }
    }, [totalComissionProp]);

    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spin indicator={customIndicator} />
                </div>
            ) : (
                <div className="boxStats">
                    <Statistic title='Total de Comissões' value={totalComissionProp} formatter={(value) => formatCurrency(parseFloat(value.toString()))} />
                </div>
            )}
        </>
    );
}

export { UserStatsCommission };
