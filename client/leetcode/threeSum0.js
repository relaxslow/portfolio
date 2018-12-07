/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    result=[];
    for(let i=0;i<nums.length;i++){
        let a=nums[i];
        for(let j=0;j<nums.length;j++){
            if(j==i)continue;
            let b=nums[j];
            for(let k=0;k<nums.length;k++){
                if(k==i||k==j)continue;
                let c=nums[k];
                let sum=a+b+c;
                let newResult=[a,b,c];
                if(sum==0 && (!isSimilar(newResult))){
                    result.push(newResult)
                console.log(newResult);    
                }
                
                
            }
        }
    
    }
    function isSimilar(r){
        for(let i=0;i<result.length;i++){
            let pickOne=result[i];
            let match=[false,false,false];

            //check r is similar to picked one
           
            for(let j=0;j<r.length;j++){
                let n=r[j];//
                for(let k=0;k<pickOne.length;k++){
                    if(n==pickOne[k]&&match[k]==false){
                        match[k]=true
                        break;
                    }
                }
            }
            if(match[0]==true&&match[1]==true&&match[2]==true)
                return true;
            else
                continue;
        }
        return false;
    }
    return result;
};

let nums = [-1, 0, 1, 2, -1, -4];
// let nums=[-4,-2,-2,-2,0,1,2,2,2,3,3,4,4,6,6];
// let nums=[-4,-2,1,-5,-4,-4,4,-2,0,4,0,-2,3,1,-5,0];
// let nums=[18,8,-15,-2,-13,8,5,6,-3,-9,3,6,-6,8,14,-9,-8,-9,-6,-14,5,-7,3,-10,-14,-12,-11,12,-15,-1,12,8,-8,12,13,-13,-3,-5,0,10,2,-11,-7,3,4,-8,9,3,-10,11,5,10,11,-7,7,12,-12,3,1,11,9,-9,-4,9,-12,-6,11,-7,4,-4,-12,13,-8,-12,2,3,-13,-12,-8,14,14,12,9,10,12,-6,-1,8,4,8,4,-1,14,-15,-7,9,-14,11,9,5,14];
console.log(threeSum(nums));