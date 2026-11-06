
FROM mcr.microsoft.com/playwright:v1.59.1-noble
WORKDIR /workspaces/healthtracker
RUN curl -fsSL https://claude.ai/install.sh | bash
ENV PATH="/root/.local/bin:${PATH}"
CMD ["sh", "-c", "until [ -x ./node_modules/.bin/http-server ]; do sleep 1; done; exec ./start.sh"]