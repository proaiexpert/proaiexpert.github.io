# Contact QA state

- Status: COMPLETE
- Jekyll install: PASS
- Webrick install: PASS
- Jekyll build: PASS
- Static generated-output checks: PASS
- Selenium install: PASS
- Headless Chrome behavior checks: FAIL
- Live Formspree submission: NOT RUN

## Build tail
```text
[33mConfiguration file: none[0m
            Source: /home/runner/work/proaiexpert.github.io/proaiexpert.github.io
       Destination: /home/runner/work/proaiexpert.github.io/proaiexpert.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
                    done in 0.176 seconds.
 Auto-regeneration: disabled. Use --watch to enable.
```
## Static tail
```text
PASS
```
## Browser tail
```text
Traceback (most recent call last):
  File "<stdin>", line 18, in <module>
  File "/home/runner/.local/lib/python3.12/site-packages/selenium/webdriver/remote/webelement.py", line 114, in click
    self._execute(Command.CLICK_ELEMENT)
  File "/home/runner/.local/lib/python3.12/site-packages/selenium/webdriver/remote/webelement.py", line 508, in _execute
    return self._parent.execute(command, params)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/runner/.local/lib/python3.12/site-packages/selenium/webdriver/remote/webdriver.py", line 492, in execute
    self.error_handler.check_response(response)
  File "/home/runner/.local/lib/python3.12/site-packages/selenium/webdriver/remote/errorhandler.py", line 232, in check_response
    raise exception_class(message, screen, stacktrace)
selenium.common.exceptions.ElementClickInterceptedException: Message: element click intercepted: Element is not clickable at point (302, 2903)
  (Session info: chrome=150.0.7871.128); For documentation on this error, please visit: https://www.selenium.dev/documentation/webdriver/troubleshooting/errors#elementclickinterceptedexception
Stacktrace:
#0 0x55a2ae29f44a <unknown>
#1 0x55a2adc778c9 <unknown>
#2 0x55a2adcd39d5 <unknown>
#3 0x55a2adcd1ab2 <unknown>
#4 0x55a2adccf49c <unknown>
#5 0x55a2adcce587 <unknown>
#6 0x55a2adcc2392 <unknown>
#7 0x55a2adcc1cd7 <unknown>
#8 0x55a2add1555d <unknown>
#9 0x55a2adcc03ff <unknown>
#10 0x55a2adcc1261 <unknown>
#11 0x55a2ae264cc7 <unknown>
#12 0x55a2ae2634a8 <unknown>
#13 0x55a2ae24e196 <unknown>
#14 0x55a2ae26406a <unknown>
#15 0x55a2ae236020 <unknown>
#16 0x55a2ae28ab98 <unknown>
#17 0x55a2ae28ad35 <unknown>
#18 0x55a2ae29dffe <unknown>
#19 0x7f883ce9caa4 <unknown>
#20 0x7f883cf29c6c <unknown>

```
