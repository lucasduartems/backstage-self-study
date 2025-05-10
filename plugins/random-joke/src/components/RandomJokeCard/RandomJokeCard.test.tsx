import { RandomJokeCard } from './RandomJokeCard';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
} from '@backstage/test-utils';

describe('RandomJokeCard', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  registerMswTestHooks(server);

  const someJoke = 'A test joke';

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get(
        'https://icanhazdadjoke.com/',
        (_, res, ctx) => res(ctx.status(200), ctx.text(someJoke))
      )
    );
  });

  it('should render', async () => {
    await renderInTestApp(<RandomJokeCard />);

    expect(screen.getByText(`Joke: ${someJoke}`)).toBeInTheDocument();
  });
});
