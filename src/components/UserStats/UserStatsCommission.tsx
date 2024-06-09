import { Statistic } from "antd";
import { formatCurrency } from "util/formatters";

const UserStatsCommission = ({ totalComissionProp }: { totalComissionProp: number }) => {
    const totalComission = totalComissionProp
    return(
        <div className="boxStats">
                <Statistic title='Total de Comissões' value={totalComission} formatter={(value) => formatCurrency(parseFloat(value.toString()))} />
        </div>
    )
}
export {UserStatsCommission}