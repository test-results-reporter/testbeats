const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('save perf results', () => {
  return {
    request: {
      method: 'POST',
      path: '/write',
      headers: {
        "authorization": "Basic dXNlcjpwYXNz"
      },
      queryParams: {
        "db": "TestResults"
      },
      body: "PerfRun,Name=TOTAL,Status=PASS status=0,transactions=2,transactions_passed=2,transactions_failed=0,samples_sum=39,samples_rate=0.55535,duration_avg=4660,duration_med=3318,duration_max=15513,duration_min=1135,duration_p90=11354,duration_p95=11446,duration_p99=15513,errors_sum=0,errors_rate=0,data_sent_sum=0,data_sent_rate=38.87,data_received_sum=0,data_received_rate=5166.44\nPerfTransaction,Name=S01_T01_Application_Launch,Status=PASS status=0,samples_sum=10,samples_rate=0.14422,duration_avg=3086,duration_med=2832,duration_max=3797,duration_min=2119,duration_p90=3795,duration_p95=3795,duration_p99=3797,errors_sum=0,errors_rate=0.001,data_sent_sum=0,data_sent_rate=5.36,data_received_sum=0,data_received_rate=2662.79\nPerfTransaction,Name=S01_T02_Application_Login,Status=PASS status=0,samples_sum=9,samples_rate=0.1461,duration_avg=4355,duration_med=3273,duration_max=10786,duration_min=3042,duration_p90=4416,duration_p95=10786,duration_p99=10786,errors_sum=0,errors_rate=0,data_sent_sum=0,data_sent_rate=12.94,data_received_sum=0,data_received_rate=2754.9"
    },
    response: {
      status: 200
    }
  }
});

addInteractionHandler('save perf results with custom tags', () => {
  return {
    request: {
      method: 'POST',
      path: '/write',
      headers: {
        "authorization": "Basic dXNlcjpwYXNz"
      },
      queryParams: {
        "db": "TestResults"
      },
      body: "PerfRun,Team=QA,App=PactumJS,Name=TOTAL,Status=PASS status=0,transactions=2,transactions_passed=2,transactions_failed=0,samples_sum=39,samples_rate=0.55535,duration_avg=4660,duration_med=3318,duration_max=15513,duration_min=1135,duration_p90=11354,duration_p95=11446,duration_p99=15513,errors_sum=0,errors_rate=0,data_sent_sum=0,data_sent_rate=38.87,data_received_sum=0,data_received_rate=5166.44\nPerfTransaction,Team=QA,App=PactumJS,Name=S01_T01_Application_Launch,Status=PASS status=0,samples_sum=10,samples_rate=0.14422,duration_avg=3086,duration_med=2832,duration_max=3797,duration_min=2119,duration_p90=3795,duration_p95=3795,duration_p99=3797,errors_sum=0,errors_rate=0.001,data_sent_sum=0,data_sent_rate=5.36,data_received_sum=0,data_received_rate=2662.79\nPerfTransaction,Team=QA,App=PactumJS,Name=S01_T02_Application_Login,Status=PASS status=0,samples_sum=9,samples_rate=0.1461,duration_avg=4355,duration_med=3273,duration_max=10786,duration_min=3042,duration_p90=4416,duration_p95=10786,duration_p99=10786,errors_sum=0,errors_rate=0,data_sent_sum=0,data_sent_rate=12.94,data_received_sum=0,data_received_rate=2754.9"
    },
    response: {
      status: 200
    }
  }
});