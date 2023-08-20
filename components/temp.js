// {
//     !imageUrl && 
//     myMSG && <>
//         <View style={toneView} >
//             <Text style={{color:'white',}}>Your text here</Text>
//         </View>
        
//         <MaskedView
//             style={ type=='theirMessage' && { backgroundColor:'red', width:'102%', minHeight:50, bottom:0, left:0, marginLeft:-5, marginBottom:-5, } || { width:'102%', minHeight:50, bottom:0,  marginLeft:0, marginBottom:-5 }}
//             maskElement={
//                 <View style={maskStyle} >
                
//                 </View>
//             }>
//             {/* Shows behind the mask, you can put anything here, such as an image */}
//             <View style={{flex: 1, width: '100%', height:'100%'}}>
//                 {/* <Text style={{ marginLeft:55 }}>sdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd</Text> */}
//                 <Text style={textStyle}>
//                     {text}
//                 </Text> 
//                 {
//                     dateString && type !== "info" && 
//                     // <View style={timeContainer} >
//                     <View style={ type=='theirMessage' && {flexDirection: 'row', justifyContent: 'flex-start', marginTop:5, marginBottom:5, marginLeft: 55,} || type=='myMessage' && {flexDirection: 'row', justifyContent: 'flex-start',  marginTop:5, marginBottom:5, marginLeft: 10,}} >
//                         { isStarred && <FontAwesome name='star' size={14} color={colors.textColor} style={{ marginRight: 5 }} /> }
//                         <Text style={styles.time}>{dateString}</Text>
//                     </View>
//                 }
//                     {/* Circle Top */}
//                     <View style={circleTop}></View>
//                     {/* Small  Circle Right */}
//                     <View style={circleRight}></View>
//                     {/* Small  Circle Left */}
//                     <View style={circleLeft}></View>
//                     {/* Big Circle */}
//                     <View style={bigCircle}></View>
                
//             </View> 
//         </MaskedView>
//     </>
    
   
// <Text style={textStyle}>
//     {text}
// </Text> 
    

// }