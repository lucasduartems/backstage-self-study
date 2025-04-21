import { SidebarItem } from '@backstage/core-components';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import VpnKey from '@material-ui/icons/VpnKey';

const LogTokenSidebarItem = () => {
    const identityApi = useApi(identityApiRef);

    const logBackstageToken = async () => {
        const credentials = await identityApi.getCredentials();
        const backstageToken = credentials.token;
        
        console.log(backstageToken);
    }

    return <SidebarItem icon={VpnKey} onClick={logBackstageToken} text="Log token" />
};

export default LogTokenSidebarItem;