import { useQuery } from "@tanstack/react-query";
import Path from '../components/Path';

export function useGameQuery(igdbGameId) {
    return useQuery({
        enabled: !!igdbGameId,
        queryKey: ['api/searchGameIgdbId', igdbGameId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const igdbGameId = queryKey[1];
            const response = await fetch(Path.buildPath(route),
                {
                    method: 'POST',
                    body: JSON.stringify({
                        igdbId: igdbGameId
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            return await response.json();
        }
    })
}