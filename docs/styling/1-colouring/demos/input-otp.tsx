/**
 * docs/styling/1-colouring/demos/input-otp.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the input otp component example.
 * @return Renders the example and returns its React element.
 */
function OtpDemo(): React.JSX.Element {
	return (
		<UI.InputOTP maxLength={4} defaultValue='2048' aria-label='Verification code'>
			<UI.InputOTPGroup>
				<UI.InputOTPSlot index={0} />
				<UI.InputOTPSlot index={1} />
				<UI.InputOTPSlot index={2} />
				<UI.InputOTPSlot index={3} />
			</UI.InputOTPGroup>
		</UI.InputOTP>
	);
}
export default OtpDemo;

export const exampleCode =
	"import { InputOTP, InputOTPGroup, InputOTPSlot } from '@terra-symposium/styling/ui';\n\n<InputOTP maxLength={4} defaultValue='2048' aria-label='Verification code'><InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /><InputOTPSlot index={3} /></InputOTPGroup></InputOTP>";
