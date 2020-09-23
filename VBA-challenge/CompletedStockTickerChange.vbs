Sub StockTickerChange():

Dim TickerName As String
Dim TickerAmount As Integer
Dim OpeningPrice As Double
Dim ClosingPrice As Double
Dim YearlyChange As Double
Dim PercentChange As Double
Dim TotalStockVolume As Double
Dim GreatestPercentIncrease As Double
Dim GreatestPercentIncreaseTicker As String
Dim GreatestPercentDecrease As Double
Dim GreatestPercentDecreaseTicker As String
Dim GreatestStockVolume As Double
Dim GreatestStockVolumeTicker As String

'loop through each worksheet in workbook'
For Each ws In Worksheets

    'Activate worksheets
    ws.Activate

    'Count the number of rows in first column and set it to the variable FinalRow
    FinalRow = ws.Cells(Rows.Count, 1).End(xlUp).Row

    'Name Columns
    ws.Range("I1").Value = "Ticker"
    ws.Range("J1").Value = "Yearly Change"
    ws.Range("K1").Value = "Percent Change"
    ws.Range("L1").Value = "Total Stock Volume"
    
    'Initialize Variables in all the worksheets!
    TickerAmount = 0
    TickerName = ""
    YearlyChange = 0
    OpeningPrice = 0
    PercentChange = 0
    TotalStockVolume = 0
    
    For i = 2 To FinalRow

        ' Get the value of the ticker symbol we are currently calculating for.
        TickerName = ws.Cells(i, 1).Value
        
        ' Get the start of the year opening price for the ticker.
        If OpeningPrice = 0 Then
            OpeningPrice = Cells(i, 3).Value
        End If
        
        ' Add up the total stock volume values for a ticker.
        TotalStockVolume = TotalStockVolume + ws.Cells(i, 7).Value
        
        ' Run this if we get to a different ticker in the list.
        If ws.Cells(i + 1, 1).Value <> TickerName Then
            
            TickerAmount = TickerAmount + 1
            ws.Cells(TickerAmount + 1, 9) = TickerName
            
            'closing price for TickerName
            ClosingPrice = Cells(i, 6)
            
            'Calculate yearly change
            YearlyChange = ClosingPrice - OpeningPrice
            
            ' Add yearly change value to the appropriate cell in each worksheet.
            ws.Cells(TickerAmount + 1, 10).Value = YearlyChange
            
            'Change cell colors based on conditions'
            '4 is red, 3 is green, 7 is magenta'

            If YearlyChange > 0 Then
                ws.Cells(TickerAmount + 1, 10).Interior.ColorIndex = 4
            
            ElseIf YearlyChange < 0 Then
                ws.Cells(TickerAmount + 1, 10).Interior.ColorIndex = 3
            
            Else
                ws.Cells(TickerAmount + 1, 10).Interior.ColorIndex = 7
            End If
            
            
            ' Calculate percent change value for ticker.
            If OpeningPrice = 0 Then
                PercentChange = 0
            Else
                PercentChange = (YearlyChange / OpeningPrice)
            End If
            
            
            'Format PercentChange
            ws.Cells(TickerAmount + 1, 11).Value = Format(PercentChange, "Percent")
         
            OpeningPrice = 0
            
            ws.Cells(TickerAmount + 1, 12).Value = TotalStockVolume
            
            'Set total stock volume back to 0 when we get to a different ticker in the list.
            TotalStockVolume = 0
        End If
        
    Next i
    
    'Name Columns
    Range("O2").Value = "Greatest % Increase"
    Range("O3").Value = "Greatest % Decrease"
    Range("O4").Value = "Greatest Total Volume"
    Range("P1").Value = "Ticker"
    Range("Q1").Value = "Value"
    
    FinalRow = ws.Cells(Rows.Count, "I").End(xlUp).Row
    
    'Initialize variables and set values of variables initially to the first row in the list.
    GreatestPercentIncrease = Cells(2, 11).Value
    GreatestPercentIncreaseTicker = Cells(2, 9).Value
    GreatestPercentDecrease = Cells(2, 11).Value
    GreatePercentDecreaseTicker = Cells(2, 9).Value
    GreatestStockVolume = Cells(2, 12).Value
    GreatestStockVolumeTicker = Cells(2, 9).Value
    
    For i = 2 To FinalRow
    
        If Cells(i, 11).Value > GreatestPercentIncrease Then
            GreatestPercentIncrease = Cells(i, 11).Value
            GreatestPercentIncreaseTicker = Cells(i, 9).Value
        End If
        
        If Cells(i, 11).Value < GreatestPercentDecrease Then
            GreatestPercentDecrease = Cells(i, 11).Value
            GreatePercentDecreaseTicker = Cells(i, 9).Value
        End If
        
       
        If Cells(i, 12).Value > GreatestStockVolume Then
            GreatestStockVolume = Cells(i, 12).Value
            GreatestStockVolumeTicker = Cells(i, 9).Value
        End If
        
    Next i
    
    Range("P2").Value = Format(GreatestPercentIncreaseTicker, "Percent")
    Range("Q2").Value = Format(GreatestPercentIncrease, "Percent")
    Range("P3").Value = Format(GreatePercentDecreaseTicker, "Percent")
    Range("Q3").Value = Format(GreatestPercentDecrease, "Percent")
    Range("P4").Value = GreatestStockVolumeTicker
    Range("Q4").Value = GreatestStockVolume
    
Next ws


End Sub