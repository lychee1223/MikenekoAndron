FROM python:3.9
WORKDIR /backend
COPY . ./

ENV POETRY_HOME="/opt/poetry"
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://install.python-poetry.org | python -
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

CMD alembic upgrade head && uvicorn main:app --reload --host 0.0.0.0
