FROM python:3.9
WORKDIR /backend

ENV POETRY_HOME="/opt/poetry"
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://install.python-poetry.org | python -
COPY ./poetry.lock ./pyproject.toml ./
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev
