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







## References

[The Ultimate Backstage Guide (2024 Version) - Backstage with OrkoHunter (Tutorial)](https://youtu.be/r46uFbu9wOs?si=W5Wj4WZKi1sdNvNq)