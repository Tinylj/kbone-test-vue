let officalBase = '';//去往官网静态页下的内容
let detailBase = '';//去往公共详情页系列下的代码
let apiBase = '';//后台接口
switch (window.location.origin) {
    case 'http://10.1.90.49:201':
		officalBase = 'http://10.1.90.49:97';
		detailBase = 'http://10.1.90.49:199';
		apiBase = "http://10.1.90.49:333";
        break;
    case 'http://10.1.80.49:201':
		officalBase = 'http://10.1.80.49:97';
		detailBase = 'http://10.1.80.49:199';
		apiBase = "http://10.1.80.49:333";
		break;
	case 'http://passport.lhseer.com':
		officalBase = 'http://www.lhseer.com';
		detailBase = 'http://platform.lhseer.com';
		apiBase = "http://gateway.lhseer.com";
		break;
	case 'https://passport.lhseer.com':
		officalBase = 'https://www.lhseer.com';
		detailBase = 'https://platform.lhseer.com';
		apiBase = "https://gateway.lhseer.com";
        break;
        // TODO: 正式环境
    default:
		officalBase = 'http://10.1.90.49:97';
		detailBase = 'http://10.1.90.49:199';
		apiBase = '';
}

const redirectUrl = {
    apiBase: apiBase,
	solution: officalBase + '/#solution',
	aboutus: officalBase + '/#aboutus',
	contact: officalBase + '/#contact',
	homepage: officalBase + '/#homepage',
	detailDashboard: detailBase + '/#/dashboard',
};

export default redirectUrl;
