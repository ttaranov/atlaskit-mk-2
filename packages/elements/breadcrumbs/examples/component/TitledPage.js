// import PropTypes from 'prop-types';
// import React, { PureComponent } from 'react';
// import HtmlPage from './HtmlPage';
// import { Link } from 'react-router-dom';
// import Breadcrumbs from '../../src/components/Breadcrumbs';
// import BreadcrumbsItem from '../../src/components/BreadcrumbsItem';
//
// // We need to take out props that Link doesn't accept
// /* eslint-disable no-unused-vars */
// const RoutedLink = ({
//   innerRef,
//   truncationWidth,
//   iconAfter,
//   iconBefore,
//   children,
//   ...rest
// }) => <Link {...rest}>{children}</Link>;
//
// export default class TitledPage extends PureComponent {
//   static propTypes = {
//     title: PropTypes.string,
//   };
//
//   render() {
//     return (
//       <HtmlPage
//         content={
//           <div>
//             <h1>{this.props.title}</h1>
//           </div>
//         }
//       >
//         <Breadcrumbs>
//           <BreadcrumbsItem
//             component={props => (
//               <RoutedLink to={'/'} {...props}>
//                 Home
//               </RoutedLink>
//             )}
//           />
//           <BreadcrumbsItem
//             component={props => (
//               <RoutedLink to={'/page1'} {...props}>
//                 Page 1
//               </RoutedLink>
//             )}
//           />
//           <BreadcrumbsItem
//             component={props => (
//               <RoutedLink to={'/page2'} {...props}>
//                 Page 2
//               </RoutedLink>
//             )}
//           />
//           <BreadcrumbsItem
//             component={props => (
//               <RoutedLink to={'/page3'} {...props}>
//                 Page 3
//               </RoutedLink>
//             )}
//           />
//         </Breadcrumbs>
//       </HtmlPage>
//     );
//   }
// }
