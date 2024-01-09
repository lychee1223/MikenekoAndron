import { Box, Divider, } from "@chakra-ui/react"
import Theme from "@/components/Theme";

// function Footer() {
//     return (
//         <Box bg={Theme.color.backgroundC}>
//             <Divider
//                 boxShadow="0px -2px 4px rgba(0, 0, 0, 0.5)"
//             />

//             {/* コピーライト */}
//             <Box p={1}>
//                 &copy;2023 skip
//             </Box>
//         </Box>
//     )
// }

const Footer = () => {
    return (
        <Box bg={Theme.color.backgroundC}>
            <Divider
                boxShadow="0px -2px 4px rgba(0, 0, 0, 0.5)"
            />

            {/* コピーライト */}
            <Box p={1}>
                &copy;2023 skip
            </Box>
        </Box>
    );
}

export default Footer;