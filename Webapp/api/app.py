from flask import Flask, request
from dgim import Dgim
import pandas as pd

app = Flask(__name__)
df = pd.read_csv("../../codon_usage.csv", low_memory=False)
df_ohe = pd.get_dummies(df[["Kingdom"]])


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/columns")
def get_columns():
    return {"columns": list(df_ohe.columns)}


@app.route("/data")
def get_data():
    return df_ohe.head().to_dict()


@app.route("/dgim")
def get_dgim():
    args = request.args
    print("ARGS", args)
    colname = request.args["colname"] if "colname" in request.args.keys(
    ) else "Kingdom_pri"
    window_size = request.args["window_size"] if "window_size" in request.args.keys(
    ) else 1000
    dgim = Dgim(N=int(window_size), error_rate=0.1)

    for i, row in df_ohe.iterrows():
        if (row[colname]):
            dgim.update(True)
        else:
            dgim.update(False)

    dgim_result = dgim.get_count()
    real_ones = int(df_ohe.iloc[-int(window_size):][colname].sum())
    return {"colname": colname, "window_size": window_size, "dgmi_result": dgim_result, "real_ones": real_ones}
