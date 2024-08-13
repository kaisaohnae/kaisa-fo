<template>
    <div class="fileUploaderWrap">
        <div class="fileItemWrap">
            <!-- 기존 파일 -->
            <div class="fileItem" v-for="(file, index) in props.fileList" :key="index" v-show="file.delYn !== 'Y'">
                <template v-if="file.fileNm.toLowerCase().match('jpg') || file.fileNm.toLowerCase().match('png') || file.fileNm.toLowerCase().match('gif') || file.fileNm.toLowerCase().match('jpeg') ">
                    <span class="icon remove" @click="remove(file)" title="파일을 저장시 삭제합니다.">&#xe042;</span>
                    <span class="icon copy" @click="copy(file)" title="이미지 복사후 에디터에 붙여넣으세요.">&#xf24d;</span>
                    <img :src="IMG_HOST + '/' + file.path + '/' + file.fileNm">
                </template>
                <template v-else>
                    <span class="icon remove" @click="remove(file)" title="파일을 저장시 삭제합니다.">&#xe042;</span>
                    <span class="icon copy" @click="copyFile(file)" title="파일 복사후 에디터에 붙여넣으세요.">&#xf24d;</span>
                    <!--<span class="icon download" @click="download(file)">&#xf0ed;</span>-->
                    <img :src="fileImgUrl" alt="" />
                </template>
            </div>
            <!-- 신규 파일 -->
            <div class="fileItem" v-for="(file, index) in props.addFileList" :key="index">
                <template v-if="file.name.toLowerCase().match('jpg') || file.name.toLowerCase().match('png') || file.name.toLowerCase().match('gif') || file.name.toLowerCase().match('jpeg')">
                    <span class="icon remove" @click="cancel(index)">&#xe042;</span>
                    <img :src="file.tempUrl" alt="" />
                </template>
                <template v-else>
                    <span class="icon remove" @click="cancel(index)">&#xe042;</span>
                    <img :src="fileImgUrl" alt="" />
                </template>
            </div>
            <br />
        </div>
        <div class="dragWrap" @drop.prevent="drop($event)" @click.self="clickOnInput()" @dragover.prevent="dragover($event)">
            <p @click.self="clickOnInput()">
                <span class="icon" @click.self="clickOnInput()">&#xe01b;</span>
                이곳에 파일을 넣어주세요. 클릭해도 됩니다.
            </p>
            <label for="file-upload" style="display:none;">
                <input multiple @change="clickedInput($event)" v-bind:id="props.name + 'FileUpload'" type="file" class="sr-only" />
            </label>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, onUpdated, watch } from 'vue';
import fileImgUrl from '../assets/img/common/file.png';
import useClipboard from 'vue-clipboard3';

const { toClipboard } = useClipboard();

const IMG_HOST = import.meta.env.VITE_IMG_HOST;

const emit = defineEmits(['set-file-list','set-add-file-list']);

interface FileInfo {
    fileNo: number;
    path: string;
    fileNm: string;
    fileOrgNm: string;
    tempUrl: string;
    delYn: string;
}

const props = defineProps({
	name: { type: String, required: true },
	fileNo: { type: Number, required: false },
    maxSize:  { type: Number, required: false, default: 10485760 }, // 10485760 10메가
    maxLength:  { type: Number, required: false, default: 10 },
	fileList: { type: Array<FileInfo>, required: false },
    addFileList: { type: Array<any>, required: false, default: []},
    delYn: { type: String, required: false, default: 'N' },
});

const remove = (file:any) => {
    file.delYn = 'Y';
    emit('set-file-list', props.fileList);
    emit('set-add-file-list', props.addFileList);
}
const download = (o:any) => {
    const url = IMG_HOST + '/' + o.path + '/' + o.fileNm;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.setAttribute('download', o.originNm);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
const copy = async (o:any) => {
    // const str = '![image](' + IMG_HOST + '/' + o.path + '/' + o.fileNm + ')';
    // ![image](http://localhost/notice/20230620094429784785.jpg)
    const str = '<img src="' + IMG_HOST + '/' + o.path + '/' + o.fileNm + '" alt=""><br />';
    await toClipboard(str);
}
const copyFile = async (o:any) => {
    //const str : string = '['+o.fileOrgNm+'](' + IMG_HOST + '/' + o.path + '/' + o.fileNm + ')';
    // [펌프킨_서버정보_230502.xlsx](http://localhost/notice/20230620100612777263.xlsx)
    const str = '<a href="' + IMG_HOST + '/' + o.path + '/' + o.fileNm + '" target="_blank">' + o.fileOrgNm + '</a><br />';
    await toClipboard(str);
}
const cancel = (index: number) => {
    props.addFileList.splice(index, 1);
    emit('set-add-file-list', props.addFileList);
}
const dragover = (e: any) => {
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
}
const drop = (e: any) => {
    e.stopPropagation();
    createFile(e);
}
const clickOnInput = () => {
    const uploadInput = document.getElementById(props.name + 'FileUpload') as HTMLElement;
    uploadInput.click();
}
const clickedInput = (e: any) => {
    createFile(e);
}
const createUrl = (o: any) => {
    o.tempUrl = URL.createObjectURL(o); // if (o.type.match(/image.*/)) {
    return o;
}
const createFile = (e: any) => {
    let files = [...e.target.files || e.dataTransfer.files]; // Array of all fileList
    if (fileCheck(files)) {
        props.addFileList.push(...files);
        emit('set-add-file-list', props.addFileList);
    }
}
const fileCheck = (value: Array<any>) => {
    let isValid = true;
    value.forEach(file => {
        if (props.maxSize < file.size) {
            isValid = false;
            alert('파일 사이즈 ' + Math.floor(props.maxSize / 1048576) + 'MB 이하로 올려주시기 바랍니다.');
        } else {
            file = createUrl(file);
        }
    });
    if (props.maxLength <= value.length) {
        isValid = false;
        alert('첨부파일은 ' + Math.floor(props.maxSize / 1048576) + 'MB 이하로 올려주시기 바랍니다.');
    }
    return isValid;
}

onMounted(() => {
	// console.log(data.addFileList);
});

watch(props.addFileList, (newVal) => {
    if (fileCheck(newVal)) {
        emit('set-add-file-list', props.addFileList);
    }
});

</script>
<style scoped>
.fileUploaderWrap {width:100%;}
.dragWrap {width:100%; text-align:center; padding:20px; border:3px dotted #aaa; background:#f1f1f1; cursor:pointer;}
.dragWrap p {font-size:11px;}
.dragWrap p .icon {font-size:30px; vertical-align:middle; margin-right:20px; color:#aaa;}
.fileItemWrap {width:100%;}
.fileItem {width: 80px; height: 80px; display: inline-block; margin: 5px; position:relative;}
.fileItem .icon {font-size:18px; text-shadow:1px 1px 2px rgba(255,255,255,0.7); color:#666;}
.fileItem .icon.remove {position:absolute; right:1px; top:1px; cursor:pointer;}
.fileItem .icon.download {position:absolute; left:1px; bottom:1px; cursor:pointer;}
.fileItem .icon.copy {position:absolute; left:1px; bottom:1px; cursor:pointer;}
.fileItem .icon:hover {color:#000;}
.fileItem video,
.fileItem img {width:80px; height:80px; border:1px solid #ddd; outline:0;}
</style>
