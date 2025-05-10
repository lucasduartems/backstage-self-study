import { InfoCard } from '@backstage/core-components';
import { fetchApiRef } from '@backstage/core-plugin-api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';


export const RandomJokeCard = () => {
    const fetchApi = useApi(fetchApiRef);

    const { value, loading, error } = useAsync(async () => {
        const response = await fetchApi.fetch('https://icanhazdadjoke.com/', {
            headers: {
                Accept: 'text/plain',
            },
        })
    
        const joke = await response.text();

        return joke;
    }, []);

    return (
        <InfoCard>
            {
                loading ? <div>Loading...</div>             :
                error   ? <div>Error: {error.message}</div> :
                          <div>Joke: {value}</div>
            }
        </InfoCard>
    );
}
