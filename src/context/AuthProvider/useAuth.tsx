import { useContext, useState } from "react";
import { AuthContext } from ".";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    // Assim que o contexto for carregado, define o estado de loading para false
    if (context !== undefined && loading) {
        setLoading(false);
    }

    return { ...context, loading };
};
