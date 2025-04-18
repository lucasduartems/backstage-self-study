# Backstage self-study

## create-app

On WSL terminal:

```bash
# Install Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc

nvm -v

# Install NodeJS
nvm install v18
nvm use global v18

node -v
npm -v

# Install Yarn
npm install --global yarn

yarn -v

# Create Backstage app
npx @backstage/create-app@latest
```

```bash
cd my-portal/

git init
git add .
```

## Commands

```bash
# Start frontend (port 3000)
yarn workspace app start

# Start backend (port 7007)
yarn workspace backend start

# Start frontend+backend
yarn start
```

## Backend Endpoints

```
http://localhost:7007/.backstage/health/v1/liveness
http://localhost:7007/.backstage/health/v1/readiness
```

## How to

- [Configure a service](https://github.com/lucasduartems/backstage-self-study/commit/4807079278a8fdbb1fa1624f16b926d80166f757)


## References

[The Ultimate Backstage Guide (2024 Version) - Backstage with OrkoHunter (Tutorial)](https://youtu.be/r46uFbu9wOs?si=W5Wj4WZKi1sdNvNq)
[Backstage docs](https://backstage.io/docs)