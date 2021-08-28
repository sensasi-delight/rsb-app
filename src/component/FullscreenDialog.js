import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { Container } from '@material-ui/core';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullscreenDialog(props) {

  return (
    <div>      
      <Dialog fullScreen open={props.isOpen} TransitionComponent={Transition}>
        <Container maxWidth="lg">
            { props.child }
            </Container>
      </Dialog>
    </div>
  );
}
