function createTable()
    {
      var processID=document.getElementById("PID").value;
      var burstTime=document.getElementById("burstTime").value;
      var arrivalTime=document.getElementById("arrivalTime").value;

        if( (processID!='') &&(burstTime!='') &&(arrivalTime!='') ) {
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

    function PrintValues() {
      
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
            
            

            // var toggle = document.getElementById("toggle").checked;
            
            // if (toggle == true)
            //     items = preemptiveSelection(pid,at,bt,flag,bt2);
            // else
            //     items = nonPreemptiveSelection(pid,at,bt,flag);            
            items = preemptiveSelection(pid,at,bt,flag,bt2);
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


          function preemptiveSelection(pid,at,bt,flag,bt2)
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
            
            var count2=0;

            while (true)
            {
                var c = n;
                var min =100;
                if (tot==n)
                {
                    items.push(temp);
                    break;
                }
                    
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
                
                // If there's no c:
                if (c==n)
                {
                    clock+=1;
                }
                // If there's a c:
                else
                {
                    bt[c]--;
                    clock++;
                    if (bt[c]==0)
                    {   
                        ct[c]=clock;
                        flag[c]=1
                        tot++;
                    }

                    if (count2==0)
                    {
                        //temp2 holds the previous c
                        var temp2=c;
                        var temp = [];
                        temp.push(pid[c]);
                        temp.push(1)
                    }

                    else
                    {
                         if (c==temp2)
                        {
                            temp[1]++;
                        }
                        else
                        {
                            items.push(temp);
                            var temp =[];
                            temp.push(pid[c]);
                            temp.push(1);
                            temp2=c;
                        }
                    }
                    console.log(c); 
                    count2++;
                }
                   
            }

            for(i=0;i<n;i++)
            {
                ta[i] = ct[i] - at[i];
                wt[i] = ta[i] - bt2[i];
                avgwt +=wt[i];
                avgta +=ta[i];
            }

            avgwt/=n;
            avgta/=n;

            printStat(ct,ta,wt,avgwt,avgta,pid);            
            return items;
                
        }

        function printStat(ct,ta,wt,avgwt,avgta,pid)
        {
            console.log(ct);
            console.log(ta);
            console.log(wt);
            console.log(avgwt);
            console.log(avgta);
            
            document.getElementById("wtOutput").innerHTML=avgwt;
            document.getElementById("taOutput").innerHTML=avgta;
            
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