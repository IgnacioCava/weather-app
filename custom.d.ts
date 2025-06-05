// import { StyledIcon } from '@styled-icons/fa-solid/types'

// declare module 'styled-icons' {
// 	const icon: StyledIcon
// 	export default icon
// }

declare module '*.svg' {
const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
export default ReactComponent;
}
