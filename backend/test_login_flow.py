import urllib.request
import urllib.parse
import http.cookiejar
import re

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# 1. GET /web/login
res = opener.open('http://localhost:8019/web/login')
html = res.read().decode('utf-8')
print('GET Status:', res.status)
print('Cookies after GET:', [(c.name, c.value[:10]) for c in cj])

csrf_match = re.search(r'name=["\']csrf_token["\']\s+value=["\']([^"\']+)["\']', html)
if not csrf_match:
    csrf_match = re.search(r'value=["\']([^"\']+)["\']\s+name=["\']csrf_token["\']', html)

if csrf_match:
    csrf = csrf_match.group(1)
    print('Found CSRF token:', csrf[:20])
    
    # 2. POST /web/login
    data = urllib.parse.urlencode({
        'login': 'admin',
        'password': 'admin',
        'csrf_token': csrf
    }).encode('utf-8')
    try:
        post_res = opener.open('http://localhost:8019/web/login', data=data)
        print('POST status:', post_res.status, post_res.geturl())
    except urllib.error.HTTPError as e:
        print('POST HTTPError:', e.code, e.read().decode('utf-8')[:200])
    except Exception as e:
        print('POST failed:', e)
else:
    print('No CSRF token found in page!')
