import pandas as pd
import json

xl = pd.ExcelFile('intern_assignment_support_pack_dev_only_v3.xlsx')

data = {}
sheets_to_extract = ['Dim_Developers', 'Fact_Jira_Issues', 'Fact_Pull_Requests', 'Fact_CI_Deployments', 'Fact_Bug_Reports']

for sheet in sheets_to_extract:
    df = xl.parse(sheet)
    # Convert dates to strings
    for col in df.select_dtypes(include=['datetime64']).columns:
        df[col] = df[col].dt.strftime('%Y-%m-%d %H:%M:%S')
    data[sheet] = df.to_dict(orient='records')

with open('frontend/src/data.json', 'w') as f:
    json.dump(data, f, indent=2)
print("Data extracted successfully to frontend/src/data.json")
