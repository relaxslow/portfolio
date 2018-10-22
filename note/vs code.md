##quick navigate
alt + -> previous cursor position
alt + <- next cursor position

##hide minimap
"editor.minimap.enabled": false,


##install glsl lint and set glslangValidator
If you are uning Windows or Linux, the best way to install glslangValidator is to install Vulkan SDK.
Get the SDK from here:

https://www.lunarg.com/vulkan-sdk/

After that, add installed glslangValidator to your PATH environment variable.
In Windows, glslangValidator will be installed in C:\VulkanSDK\( version )\Bin.

The path of glslangValidator can also be specified in the settings of VEDA.
Add the path of glslangValidator (e.g.: C:\VulkanSDK( version )\Bin\glslangValidator.exe) to glslangValidator path property.

paste the path to the vscode setting.