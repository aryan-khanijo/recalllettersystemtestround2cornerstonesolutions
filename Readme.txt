1.Read CSV and find Start_run in all column and if find in any row,take time (Epoch) value from the cell and find its time in video_duration.json file.
2.Once video time found in file save video in DB and if not found then no video found for the record save with entire rown and result will save in column "scanResult".

3.Once start_run then in next iteration add 250 constant value in chainage of previously selected row and then process goes on.

48062.55859 + 250 = 48312.5586 find the next row, with chainage value equal to greater than 48312.5586 and similiar step as 1



Example:
1.start run find in first row its (Epoch) value is 7-21-2023 2:23:50 AM find the video clip come under this time you will get this video "20230721T022313.mp4".