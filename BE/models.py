from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class Query(BaseModel):
    message: str

class ToolsSuggestRequest(BaseModel):
    max_tools: int = Field(default=10, ge=1, le=100)
    date: Optional[str] = None

class Tool(BaseModel):
    model_config = ConfigDict(extra="ignore")

    tool_name: str
    category: str
    description: str
    main_features: str
    supported_languages_or_models: str
    license: str
    last_known_update_or_version: str
    official_website_or_repository: str
    relevance_score: Optional[int] = None

class ToolsSuggestResponse(BaseModel):
    provider: str
    model: str
    csv: str
    tools: list[Tool]
