/* LW STANDARD CODE */
const isStaging = window.location?.href?.startsWith('https://staging.file.io');
const libUrl = isStaging ? 'https://frontend-staging-main.staging.limewire.com/file-sharing-lib/file-sharing-lib.es.js' : 'https://limewire.com/file-sharing-lib/file-sharing-lib.es.js';
const fileSharingLib = await import(libUrl);

window.fileSharingLib = fileSharingLib;

var allFiles = [];
var filesUploaded = [];

const uploadFilesInput = document.querySelector('#select-files-input');
const uploadFolderInput = document.querySelector('#upload-folder');
const uploadDragDrop = document.querySelector('#upload-drag-drop');
const uploadEntriesElement = document.querySelector('#upload-entries');

const { Upload, getDataTransferFiles, getUploadEntryIcon, getFileExtension, getFileSize, canUploadAllFiles } = window.fileSharingLib;

const createHtmlElement = (htmlString) => {
  const div = document.createElement('div');
  //div.innerHTML = htmlString.trim();
  return div.firstChild;
}
const getUploadEntryHtml = (uploadEntry) => {
  const { result } = uploadEntry;

  const resultText = result ? result.ok ? 'Uploaded' : result.error.message : '';
  const error = result && !result.ok;
  const success = result && result.ok;
  const preview = uploadEntry.previews[0];
  const icon = getUploadEntryIcon(uploadEntry);

  //return '<div id="upload-entry-' + uploadEntry.id + '" class="upload-entry ' + (error ? 'error' : '') + ' ' + (success ? 'success' : '') + '"><div class="images"><div><p>Icon:</p>' + icon + '</div>' + (preview ? '<div><p>Preview:</p><img src="' + preview.url + '"></img></div>' : '') + '</div><p>Name: ' + uploadEntry.file.name + '</p><p>Size: ' + getFileSize(uploadEntry.file.size) + '</p><p>Stage: <span class="stage">' + uploadEntry.stage + '</span></p><p>Progress: <span class="progress">' + uploadEntry.file.uploadProgress + '</span></p><p>Result: <span class="result">' + resultText + '</span></p></div>';
}
const sharingBucketUpload = new Upload({
  apiBaseUrl: isStaging ? 'https://backend-staging-main.staging.limewire.com' : 'https://api.limewire.com',
  linkBaseUrl: isStaging ? 'https://frontend-staging-main.staging.limewire.com' : 'https://limewire.com/',
  sharingBucketName: (files) => {
    return files[0].name;
  },
  entryAdded: (uploadEntry) => {
    const uploadEntryElement = createHtmlElement(getUploadEntryHtml(uploadEntry));

    $('body').find('.lw_modal').removeClass('initializing').show();

    $('body').find('.lw_modal_files_container').append('<div data-upload-id="' + uploadEntry.id + '" data-upload-size="' + uploadEntry.file.size + '" class="lw_modal_file"><div class="lw_file_name">' + uploadEntry.file.name + '</div><div class="lw_file_size">' + getFileSize(uploadEntry.file.size) + '</div><div class="lw_file_progress"><div class="lw_progress_bar" style="width: 0%"></div><div class="lw_progress_percentage">0%</div></div><div class="lw_file_icon"></div></div>');

  },
  entryUpdated: (uploadEntry) => {
    const uploadEntryElement = document.querySelector('#upload-entry-' + uploadEntry.id);

    var numberOfFiles = parseInt($('body').find('[data-upload-id]').length);

    $('body').find('[data-upload-id]').each(function () {

      if ($.inArray(uploadEntry.id, allFiles) == -1) {
        allFiles.push(uploadEntry.id);
      }

      if ($(this).attr('data-upload-id') == uploadEntry.id) {

        //console.log('allFiles');
        //console.log(allFiles);

        var progress100 = (uploadEntry.file.uploadProgress * 100).toFixed(0);

        $(this).find('.lw_file_progress').attr('data-upload-progress', progress100);
        $(this).find('.lw_file_progress .lw_progress_bar').css('width', progress100 + '%');
        $(this).find('.lw_file_progress .lw_progress_percentage').text(progress100 + '%');

        if (uploadEntry.file.uploadProgress == 1 && ($.inArray(uploadEntry.id, filesUploaded) == -1)) {
          filesUploaded.push(uploadEntry.id);
        }

        //console.log('filesUploaded');
        //console.log(filesUploaded);
      }

    });

    if (allFiles.length == filesUploaded.length) {

      $('body').find('.lw_redirect_dialog span').text('Redirecting you to LimeWire ...');

      // get claim link
      sharingBucketUpload.getClaimLink('pq7i8xx7p2', true).then((claimLink) => {
        console.log("claimLink", claimLink);
        setTimeout(function () {
          window.location.replace(claimLink);
          return;
        }, 1000);
      });
    }
  }
});
/*
uploadFilesInput.addEventListener('change', () => {
  const { target } = event;
  sharingBucketUpload.addEntries(target.files);
});
uploadFolderInput.addEventListener('change', () => {
  const { target } = event;
  sharingBucketUpload.addEntries(target.files);
});
*/

uploadFilesInput.addEventListener('change', (event) => {
  const { target } = event;

  $('body').find('.lw_modal').addClass('initializing').fadeIn();
	
  if (sharingBucketUpload.canUploadAllFiles(target.files)) {
    sharingBucketUpload.addEntries(target.files);
  }
  else {
    console.log('Too big!');

	  $('body').find('.lw_modal').addClass('has_login_signup_popup').fadeIn();
	  $('body').find('.lw_modal_container .lw_modal_footer').append('<div class="in_login_signup_popup lw_modal_text"> <p><strong>This file is too large. Please use LimeWire instead!</strong></p> <p>Please note that we can only support files with a maximum size of 4GB. To upload larger files of up to 5TB, please use the button below to sign up for a LimeWire account. </p> </div> <div class="in_login_signup_popup lw_modal_cta"> <a class="in_login_signup_popup lw_modal_to_lw_btn" href="https://limewire.com/auth">Switch to LimeWire</a> </div>');
    
  }
});

uploadFolderInput.addEventListener('change', (event) => {
  const { target } = event;

  $('body').find('.lw_modal').addClass('initializing').fadeIn();
	
  if (sharingBucketUpload.canUploadAllFiles(target.files)) {
    sharingBucketUpload.addEntries(target.files);
  }
  else {
    console.log('Too big!');

	  $('body').find('.lw_modal').addClass('has_login_signup_popup').fadeIn();
	  $('body').find('.lw_modal_container .lw_modal_footer').append('<div class="in_login_signup_popup lw_modal_text"> <p><strong>This file is too large. Please use LimeWire instead!</strong></p> <p>Please note that we can only support files with a maximum size of 4GB. To upload larger files of up to 5TB, please use the button below to sign up for a LimeWire account. </p> </div> <div class="in_login_signup_popup lw_modal_cta"> <a class="in_login_signup_popup lw_modal_to_lw_btn" href="https://limewire.com/auth">Switch to LimeWire</a> </div>');
    
  }
});

uploadDragDrop.addEventListener('dragover', (event) => {
  event.preventDefault();
});
uploadDragDrop.addEventListener('drop', async (event) => {
  event.preventDefault();

  $('body').find('.lw_modal').addClass('initializing').fadeIn();
	
  const files = await getDataTransferFiles(event.dataTransfer);
  if (canUploadAllFiles(files.flat())) {
    files.forEach((fileDescriptors) => {
      sharingBucketUpload.addEntries(fileDescriptors);
    });  
  } else {
    console.log('Too big!');

	  $('body').find('.lw_modal').addClass('has_login_signup_popup').fadeIn();
	  $('body').find('.lw_modal_container .lw_modal_footer').append('<div class="in_login_signup_popup lw_modal_text"> <p><strong>This file is too large. Please use LimeWire instead!</strong></p> <p>Please note that we can only support files with a maximum size of 4GB. To upload larger files of up to 5TB, please use the button below to sign up for a LimeWire account. </p> </div> <div class="in_login_signup_popup lw_modal_cta"> <a class="in_login_signup_popup lw_modal_to_lw_btn" href="https://limewire.com/auth">Switch to LimeWire</a> </div>');
    
  }
});
/* LW STANDARD CODE */
