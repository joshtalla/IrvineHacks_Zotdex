def is_post(req):
    return req.method == "POST"

def is_get(req):
    return req.method == "GET"

def matched_params(req, params, optional_params = []):
    data = req.GET if is_get(req) else req.POST
    return len((set(data) - set(["csrfmiddlewaretoken"])) ^ (set(params) - set(optional_params))) == 0

def is_user(req):
    return "user" in req.session

def is_not_user(req):
    return "user" not in req.session

def username(string):
    return 3 <= len(string) <= 32

def password(string):
    return 8 <= len(string) <= 32
