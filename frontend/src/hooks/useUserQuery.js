import { useQuery } from "@tanstack/react-query";
import Path from '../components/Path';

export function useUserQuery(userId) {
    return useQuery({
        queryKey: ['api/searchUserId', userId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const userId = queryKey[1];
            const response = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ 
                    userId: userId
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const yeah = await response.json();
            console.log(yeah, "is yeah");
            return yeah;
        }
    })
}
