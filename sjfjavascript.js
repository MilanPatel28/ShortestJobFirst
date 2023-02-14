function createTable()
    {
      var processID=document.getElementById("PID").value;
      var burstTime=document.getElementById("burstTime").value;
      var arrivalTime=document.getElementById("arrivalTime").value;

      if( (processID=='') &&(burstTime=='') &&(arrivalTime=='')) {
        alert("Please insert some data first!!");
      }
      else if( (processID<=0) || (burstTime<=0) || (arrivalTime<=0) ) {
        alert("Negative or zero values are not accepted");
      }
      else {
            var table=document.getElementById("inputTable");
            var firstRow = table.insertRow(-1);
            var cell1 = firstRow.insertCell(0);
            var cell2 = firstRow.insertCell(1);
            var cell3 = firstRow.insertCell(2);
    
            cell1.innerHTML=processID;
            cell2.innerHTML=burstTime;
            cell3.innerHTML=arrivalTime;
      }
      var x = document.getElementById("inputTable").rows.length;
    }

function clearCell() {
    document.getElementById("PID").value = '';
    document.getElementById("burstTime").value = '';
    document.getElementById("arrivalTime").value = '';
}

        function GetCellValues()
        {
            var pid =[];
            var at =[];
            var bt =[];
            var flag =[];
            var bt2=[];

            // items is the sorted list
            var items = [];

            var table = document.getElementById('inputTable');
            for (var r = 1, n = table.rows.length; r < n; r++) {
                for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
                     //console.log(table.rows[r].cells[c].innerHTML);
                }
                pid.push(parseInt(table.rows[r].cells[0].innerHTML));
                bt.push(parseInt(table.rows[r].cells[1].innerHTML));
                bt2.push(parseInt(table.rows[r].cells[1].innerHTML));
                at.push(parseInt(table.rows[r].cells[2].innerHTML));
                flag.push(0);
            }
            items = nonPreemptiveSelection(pid,at,bt,flag);
            return items;
          }

          function nonPreemptiveSelection(pid,at,bt,flag)
          {
            var n = pid.length;
            var clock = 0;
            var tot = 0;
            var items =[];
            var ct=[];
            var ta=[];
            var wt=[];
            var avgwt=0;
            var avgta=0;

            while(true)
            {
                var min=100;
                var c = n; // c represents the current PID
                if (tot == n) // total no of process = completed process loop will be terminated
                    break;
                
                for (var i=0; i< n; i++)
                {
                    /*
                     * If i'th process arrival time <= system time and its flag=0 and burst<min 
                     * That process will be executed first 
                     */
                    var count=0;
                    if ((at[i] <= clock) && (flag[i] == 0) && (bt[i]<min))
                        {
                            min=bt[i];
                            c=i;
                        }
                }
                /* If c==n means c value can not updated because no process arrival time< system time so we increase the system time */
                if (c==n) 
                    clock++;
                else
                {
                    var temp = [];
                    temp.push(pid[c]);
                    temp.push(bt[c]);
                    items.push(temp);

                    ct[c]=clock+bt[c];
                    ta[c]=ct[c]-at[c];
                    wt[c]=ta[c]-bt[c];
                    
                    clock+=bt[c];
                    flag[c]=1;
                    tot++;   
                }
            }

            for(i=0;i<n;i++)
            {
                avgwt +=wt[i];
                avgta +=ta[i];
            }

            avgwt/=n;
            avgta/=n;
            printStat(ct,ta,wt,avgwt,avgta,pid); 
            return items;
          }

        function generateGanttChartData(data)
        {   
            // Data contains the processes in the required order
            var n = data.length;
            var finalData = [];
            var clock = 0;
            
            //console.log(n);

            for (var i=0; i<n; i++)
            {
                var temp = {
                        "category": "",
                        "segments": [ {
                            "start": 0,
                            "duration": 0,
                            "color": "#727d6f",
                            "task": ""
                        }, ]
                    }

                temp.category = "Process " + (parseInt(data[i][0])).toString();
                temp.segments[0].start = clock;
                temp.segments[0].duration = data[i][1];
                temp.segments[0].task = "Process " + (parseInt(data[i][0])).toString();

                clock = clock + data[i][1];
                finalData.push(temp);
            }
            return finalData;
        }

        function printStat(ct,ta,wt,avgwt,avgta,pid)
        {
            console.log(ct);
            console.log(ta);
            console.log(wt);
            console.log(avgwt);
            console.log(avgta);
            
            document.getElementById("wtOutput").innerHTML=((avgwt).toFixed(5));
            document.getElementById("taOutput").innerHTML=((avgta).toFixed(5));
            
            var table_2=document.getElementById("statTable");
        
            console.log("len");
            console.log(table_2.rows.length);

            for(var i = table_2. rows. length; i > 1; i--)
            {
                    console.log(i);
                    table_2. deleteRow(i-1);
            }

            for (var i=0;i<pid.length;i++)
            {   
            var firstRow = table_2.insertRow(i+1);
            var cell1 = firstRow.insertCell(0);
            var cell2 = firstRow.insertCell(1);
            var cell3 = firstRow.insertCell(2);
            var cell4 = firstRow.insertCell(3);
                cell1.innerHTML=pid[i];
                cell2.innerHTML=ct[i];
                cell3.innerHTML=ta[i];
                cell4.innerHTML=wt[i];
            }
        }

        function printGanttChart()
        {
            //chartData contains data for dataProvider KEY
            var chartData = generateGanttChartData(GetCellValues());

            var chart = AmCharts.makeChart( "chartdiv", 
                {
                "type": "gantt",
                "theme": "dark",
                "marginRight": 70,
                "period": "hh:mm:ss",
                "dataDateFormat":"YYYY-MM-DD",
                "balloonDateFormat": "JJ:NN",
                "columnWidth": 0.5,
                "valueAxis": {
                    "type": "timecode"
                },
                "brightnessStep": 10,
                "graph": {
                    "fillAlphas": 1,
                    "balloonText": "<b>[[task]]</b>: [[open]] [[value]]"
                },
                "rotate": true,
                "categoryField": "category",
                "segmentsField": "segments",
                "colorField": "color",
                "startDate": "00:00:00:00",
                "startField": "start",
                "endField": "end",
                "durationField": "duration",


                // This key contains values generated by generateGanttChartData FUNCTION
                "dataProvider": chartData,


                "valueScrollbar": {
                    "autoGridCount":true
                },
                "chartCursor": {
                    "cursorColor":"#55bb76",
                    "valueBalloonsEnabled": false,
                    "cursorAlpha": 0,
                    "valueLineAlpha":0.5,
                    "valueLineBalloonEnabled": true,
                    "valueLineEnabled": true,
                    "zoomable":false,
                    "valueZoomable":true
                },
                "export": {
                    "enabled": true
                 }
            } );
        }