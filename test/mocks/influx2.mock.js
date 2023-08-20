const { addInteractionHandler } = require('pactum').handler;
const { regex } = require('pactum-matchers');

addInteractionHandler('save perf results to influx2', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/v2/write',
      headers: {
        "authorization": "Token testtoken"
      },
      queryParams: {
        "org": "testorg",
        "bucket": "testbucket",
        "precision": "ns"
      },
      body: regex('PerfRun', /PerfRun,Name=TOTAL,Status=PASS data_received_rate=5166.44,data_received_sum=362818330,data_sent_rate=38.87,data_sent_sum=2729683,duration_avg=4660,duration_max=15513,duration_med=3318,duration_min=1135,duration_p90=11354,duration_p95=11446,duration_p99=15513,errors_rate=0,errors_sum=0,samples_rate=0.55535,samples_sum=39,status=0,transactions=2,transactions_failed=0,transactions_passed=2 \d+\nPerfRun,Name=S01_T01_Application_Launch,Status=PASS data_received_rate=2662.79,data_received_sum=184633892,data_sent_rate=5.36,data_sent_sum=371654,duration_avg=3086,duration_max=3797,duration_med=2832,duration_min=2119,duration_p90=3795,duration_p95=3795,duration_p99=3797,errors_rate=0.001,errors_sum=0,samples_rate=0.14422,samples_sum=10,status=0 \d+\nPerfRun,Name=S01_T02_Application_Login,Status=PASS data_received_rate=2754.9,data_received_sum=169706365,data_sent_rate=12.94,data_sent_sum=797125,duration_avg=4355,duration_max=10786,duration_med=3273,duration_min=3042,duration_p90=4416,duration_p95=10786,duration_p99=10786,errors_rate=0,errors_sum=0,samples_rate=0.1461,samples_sum=9,status=0 \d+/)
    },
    response: {
      status: 204
    }
  }
});

addInteractionHandler('save perf results with custom tags and fields to influx2', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/v2/write',
      headers: {
        "authorization": "Token testtoken"
      },
      queryParams: {
        "org": "testorg",
        "bucket": "testbucket",
        "precision": "ns"
      },
      body: regex("PerfRun", /PerfRun,App=PactumJS,Name=TOTAL,Status=PASS,Team=QA data_received_rate=5166.44,data_received_sum=362818330,data_sent_rate=38.87,data_sent_sum=2729683,duration_avg=4660,duration_max=15513,duration_med=3318,duration_min=1135,duration_p90=11354,duration_p95=11446,duration_p99=15513,errors_rate=0,errors_sum=0,id=123,samples_rate=0.55535,samples_sum=39,status=0,transactions=2,transactions_failed=0,transactions_passed=2 \d+\nPerfRun,App=PactumJS,Name=S01_T01_Application_Launch,Status=PASS,Team=QA data_received_rate=2662.79,data_received_sum=184633892,data_sent_rate=5.36,data_sent_sum=371654,duration_avg=3086,duration_max=3797,duration_med=2832,duration_min=2119,duration_p90=3795,duration_p95=3795,duration_p99=3797,errors_rate=0.001,errors_sum=0,id=123,samples_rate=0.14422,samples_sum=10,status=0 \d+\nPerfRun,App=PactumJS,Name=S01_T02_Application_Login,Status=PASS,Team=QA data_received_rate=2754.9,data_received_sum=169706365,data_sent_rate=12.94,data_sent_sum=797125,duration_avg=4355,duration_max=10786,duration_med=3273,duration_min=3042,duration_p90=4416,duration_p95=10786,duration_p99=10786,errors_rate=0,errors_sum=0,id=123,samples_rate=0.1461,samples_sum=9,status=0 \d+/)
    },
    response: {
      status: 204
    }
  }
});

addInteractionHandler('save test results to influx2', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/v2/write',
      headers: {
        "authorization": "Token testtoken"
      },
      queryParams: {
        "org": "testorg",
        "bucket": "testbucket",
        "precision": "ns"
      },
      body: regex("TestRun", /TestRun,Name=Default\\ suite,Status=PASS duration=2000,failed=0,passed=4,status=0,total=4 \d+\nTestSuite,Name=Default\\ test,Status=PASS duration=2000,failed=0,passed=4,status=0,total=4 \d+\nTestCase,Name=c2,Status=PASS duration=0,status=0 \d+\nTestCase,Name=c3,Status=PASS duration=10,status=0 \d+\nTestCase,Name=c1,Status=PASS duration=0,status=0 \d+\nTestCase,Name=c4,Status=PASS duration=0,status=0 \d+/)
    },
    response: {
      status: 204
    }
  }
});

addInteractionHandler('save test results with custom tags and fields to influx2', () => {
  return {
    strict: false,
    request: {
      method: 'POST',
      path: '/api/v2/write',
      headers: {
        "authorization": "Token testtoken"
      },
      queryParams: {
        "org": "testorg",
        "bucket": "testbucket",
        "precision": "ns"
      },
      body: regex("TestRun", /TestRun,App=PactumJS,Name=Staging\\ -\\ UI\\ Smoke\\ Test\\ Run,Status=FAIL,Team=QA duration=1883597,failed=1,id=123,passed=1,status=1,stringfield="coolvalue",total=2 \d+\nTestSuite,App=PactumJS,Name=desktop-chrome,Status=PASS,Team=QA duration=1164451,failed=0,id=123,passed=1,status=0,stringfield="coolvalue",total=1 \d+\nTestCase,App=PactumJS,Name=GU,Status=PASS,Team=QA duration=243789,id=123,status=0,stringfield="coolvalue" \d+\nTestSuite,App=PactumJS,Name=mobile-andoid,Status=FAIL,Team=QA duration=714100,failed=1,id=123,passed=0,status=1,stringfield="coolvalue",total=1 \d+\nTestCase,App=PactumJS,Name=GU,Status=FAIL,Team=QA duration=156900,id=123,status=1,stringfield="coolvalue" \d+/)
    },
    response: {
      status: 204
    }
  }
});
