
instance_name = 'votr'

log_path = './logs/'

session_path = './sessions/'

cosign_proxy = None

cosign_proxy_logout = 'https://login.uniba.sk/logout.cgi'

servers = [
    dict(
        title='ais2.uniba.sk + REST',
        login_types=('cosignpassword', 'cosigncookie'),
        ais_cookie='cosign-filter-ais2.uniba.sk',
        ais_url='https://ais2.uniba.sk/',
        rest_cookie='cosign-filter-int-dev.uniba.sk',
        rest_url='https://int-dev.uniba.sk:8443/'
    ),
    dict(
        title='ais2.uniba.sk',
        login_types=('cosignpassword', 'cosigncookie'),
        ais_cookie='cosign-filter-ais2.uniba.sk',
        ais_url='https://ais2.uniba.sk/',
    ),
    dict(
        title='ais2-beta.uniba.sk',
        login_types=('cosignpassword', 'cosigncookie'),
        ais_cookie='cosign-filter-ais2-beta.uniba.sk',
        ais_url='https://ais2-beta.uniba.sk/',
    ),
    dict(
        title='ais2.euba.sk',
        login_types=('plainpassword',),
        ais_url='https://ais2.euba.sk/',
    ),
    dict(
        title='Demo',
        login_types=('demo',),
    ),
]