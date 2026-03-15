    // {
    //   "name": "Registration",
    //   "item": [
    //     {
    //       "name": "Submit Registration",
    //       "request": {
    //         "method": "POST",
    //         "header": [
    //           {
    //             "key": "Content-Type",
    //             "value": "application/json"
    //           }
    //         ],
    //         "url": {
    //           "raw": "{{base_url}}/registration/submit/",
    //           "host": [
    //             "{{base_url}}"
    //           ],
    //           "path": [
    //             "registration",
    //             "submit"
    //           ]
    //         },
    //         "body": {
    //           "mode": "raw",
    //           "raw": "{\n    \"person\": 1,\n    \"program\": 1,\n    \"notes\": \"طلب تسجيل تجريبي\"\n}"
    //         }
    //       },
    //       "response": []
    //     },
    //     {
    //       "name": "Track Registration",
    //       "request": {
    //         "method": "GET",
    //         "header": [],
    //         "url": {
    //           "raw": "{{base_url}}/registration/track/{{tracking_code}}/",
    //           "host": [
    //             "{{base_url}}"
    //           ],
    //           "path": [
    //             "registration",
    //             "track",
    //             "{{tracking_code}}"
    //           ]
    //         }
    //       },
    //       "response": []
    //     },
    //     {
    //       "name": "Approve Registration",
    //       "request": {
    //         "method": "POST",
    //         "header": [
    //           {
    //             "key": "Content-Type",
    //             "value": "application/json"
    //           }
    //         ],
    //         "url": {
    //           "raw": "{{base_url}}/registration/1/approve/",
    //           "host": [
    //             "{{base_url}}"
    //           ],
    //           "path": [
    //             "registration",
    //             "1",
    //             "approve"
    //           ]
    //         },
    //         "body": {
    //           "mode": "raw",
    //           "raw": "{}"
    //         }
    //       },
    //       "response": []
    //     },
    //     {
    //       "name": "Reject Registration",
    //       "request": {
    //         "method": "POST",
    //         "header": [
    //           {
    //             "key": "Content-Type",
    //             "value": "application/json"
    //           }
    //         ],
    //         "url": {
    //           "raw": "{{base_url}}/registration/1/reject/",
    //           "host": [
    //             "{{base_url}}"
    //           ],
    //           "path": [
    //             "registration",
    //             "1",
    //             "reject"
    //           ]
    //         },
    //         "body": {
    //           "mode": "raw",
    //           "raw": "{\n    \"reason\": \"سبب الرفض\"\n}"
    //         }
    //       },
    //       "response": []
    //     },
    //     {
    //       "name": "List Registration Requests",
    //       "request": {
    //         "method": "GET",
    //         "header": [],
    //         "url": {
    //           "raw": "{{base_url}}/registration/requests/",
    //           "host": [
    //             "{{base_url}}"
    //           ],
    //           "path": [
    //             "registration",
    //             "requests"
    //           ]
    //         }
    //       },
    //       "response": []
    //     },
    //     {
    //       "name": "Create Registration Request",
    //       "request": {
    //         "method": "POST",
    //         "header": [
    //           {
    //             "key": "Content-Type",
    //             "value": "application/json"
    //           }
    //         ],
    //         "url": {
    //           "raw": "{{base_url}}/registration/requests/",
    //           "host": [
    //             "{{base_url}}"
    //           ],
    //           "path": [
    //             "registration",
    //             "requests"
    //           ]
    //         },
    //         "body": {
    //           "mode": "raw",
    //           "raw": "{\n    \"person\": 1,\n    \"program\": 1,\n    \"notes\": \"طلب من الإدارة\"\n}"
    //         }
    //       },
    //       "response": []
    //     },
    //     {
    //       "name": "List Registration Settings",
    //       "request": {
    //         "method": "GET",
    //         "header": [],
    //         "url": {
    //           "raw": "{{base_url}}/registration/settings/",
    //           "host": [
    //             "{{base_url}}"
    //           ],
    //           "path": [
    //             "registration",
    //             "settings"
    //           ]
    //         }
    //       },
    //       "response": []
    //     },
    //     {
    //       "name": "Create Registration Settings",
    //       "request": {
    //         "method": "POST",
    //         "header": [
    //           {
    //             "key": "Content-Type",
    //             "value": "application/json"
    //           }
    //         ],
    //         "url": {
    //           "raw": "{{base_url}}/registration/settings/",
    //           "host": [
    //             "{{base_url}}"
    //           ],
    //           "path": [
    //             "registration",
    //             "settings"
    //           ]
    //         },
    //         "body": {
    //           "mode": "raw",
    //           "raw": "{\n    \"program\": 1,\n    \"is_open\": true,\n    \"max_accepted\": 100\n}"
    //         }
    //       },
    //       "response": []
    //     }
    //   ]
    // },
