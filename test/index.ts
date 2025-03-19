import { EAppParamKind, env, Go } from '../src'

env.args = {
    kind: EAppParamKind.firmRu,
    count: 1000
}
Go()