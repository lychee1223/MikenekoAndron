import { IconButton, } from '@chakra-ui/react'

const handleOpenGmail = () => {
    const email = "lychee.vinculum@gmail.com"   // 宛先アドレス

    // 新規Gmail送信ページを開く
    const URL = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${email}`
    window.open(URL, "_blank");
};

//function MailToIcon(props) {
const MailToIcon = (props: any) => {
    return (
        <IconButton
            onClick={handleOpenGmail}
            icon={props.icon}
            fontSize={props.fontSize}
            colorScheme={props.color}
            aria-label={''}
        />
    )
}

export default MailToIcon;