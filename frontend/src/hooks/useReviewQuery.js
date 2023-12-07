import { useQuery } from "@tanstack/react-query";
import Path from '../components/Path';

export function useReviewQuery(reviewId) {
    return useQuery({
        enabled: !!reviewId,
        queryKey: ['api/searchReviewId', reviewId],
        queryFn: async ({ queryKey }) => {
            const route = queryKey[0];
            const reviewId = queryKey[1];
            const response = await fetch(Path.buildPath(route), {
                method: 'POST',
                body: JSON.stringify({ 
                    reviewId: reviewId 
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return await response.json();
        }
    })
}