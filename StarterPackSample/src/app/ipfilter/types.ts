import { IpFilterRule } from '@iotHubControlPlane/lib/models';

export interface IpFilterRuleExtended extends IpFilterRule {
    key: number;
}