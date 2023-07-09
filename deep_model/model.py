import sys
import numpy as np
import pandas as pd
import ast
from keras.models import load_model

# path = './normal/n_c.csv'
# 100 * 3
test = str(sys.argv[1])
newData = ast.literal_eval(test)
# print newData size
print(len(newData))
df = newData

x_reshaped = np.asarray(df, dtype= np.float32).reshape(-1, 100, 3)
loaded_model = load_model("./deep_model/model.h5")

y_pred = loaded_model.predict(x_reshaped)
y_pred_lbl = np.argmax(y_pred, axis=1)
a = np.unique(y_pred_lbl, return_counts=True)
print("out" , y_pred_lbl)
sys.stdout.flush()