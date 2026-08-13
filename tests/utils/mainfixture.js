const base = require('@playwright/test');


exports.test = base.test.extend(
    {
        regularUserCredentials: {
            userEmailId: "gayatriis9505@gmail.com",
            password: "P@ssword001",
            //Test
            /* client: "Insite Automation (Test)",
            clientAlias: "insiteautomation-test",
            baseUrl: "https://discover-test.nv5geospatial.com", */

            //Staging
            client: "Insite Automation (Staging)",            
            clientAlias: "insiteautomation-staging",            
            baseUrl: "https://discover-staging.nv5geospatial.com",

            //Common
            userGroup: "CoreModules"

        },

        adminCredentials: {
            //Staging
            client: "Insite Automation (Staging)",
            clientAlias: "insiteautomation-staging",
            baseUrl: "https://discover-staging.nv5geospatial.com",
            apiReqLogin : "https://staging.api.discover.nv5geospatial.com/auth/login",
            apiReqUsrProfile : "https://staging.api.discover.nv5geospatial.com/api/current_user",

            //Test
            /* client: "Insite Automation (Test)",
            clientAlias: "insiteautomation-test",
            baseUrl: "https://discover-test.nv5geospatial.com",
            apiReqLogin : "https://test.api.discover.nv5geospatial.com/auth/login",
            apiReqUsrProfile : "https://test.api.discover.nv5geospatial.com/api/current_user", */

            //Common
            userEmailId: "gayatriis9562@gmail.com",
            password: "P@ssword001",
            regularUserEmailId: "gayatriis9505@gmail.com",
            regularUserpassword: "P@ssword001",            
            userGroup: "CoreModules",            
            createUserGrp:"TestAutomateGroup1",
            switchFtr:"TestAutomateSwitch1",
            polesFtr:"TestAutomatePoles",
            spansFtr: "TestAutomateOncorSpans",
            wfsPolyFtr: "TestAutomateWFSPoly",
            esFtr: "TestAutomateES",
            domainValues: {
                int_field:{name:'DESIGN_VOLTAGE', value:'67'},
                date_field:{name:'LAST_INSPECT_DATE',value:'12/13/2017'},
                float_field:{name:'LATITUDE', value:'34.578'},
                new_field:{name:'TestNewField', value:['t1','t2']}
                
                },
            filterPreset:"TestAutomateFilter1",
            bookmark: "TestAutomateBkmrk"
        },
        dataDelivery: {
            userGroup: "CoreModules",
            prjFolder: "Automation_OLC_West_Metro_3DEP_2019_034962",
            mainFolders: ["20200715"],
            //subFoldersLevel1: ["AddedSubfolder", "metadata", "other", "point_cloud"],
            //subFoldersLevel2: ["Subfolder2", "shapefiles", "DZ_ortho", "Swath_shapes", "laz", "T640_Eng_Meyers_Stateline"],
            subFoldersLevel1: ["AddedSubfolder"],
            subFoldersLevel2: ["Subfolder2"],
            filesPath: "20200715/metadata/shapefiles/METRO_2019_3DEP_BLOCKS.cpg:METRO_2019_3DEP_BLOCKS.shx",
            //zipFilePckg: "Automation_OLC_West_Metro_3DEP_2019_034962/20200715/AddedSubfolder",
            zipFilePckg: "EDP_Scarlet_Solar_R037804/EDP_SCARLET_SOLAR_DELIVERABLES/05_Metadata",
            cyberduckPckg: "Automation_OLC_West_Metro_3DEP_2019_034962/20200715/point_cloud/T640_Eng_Meyers_Stateline",
            awsCliPckg: "Automation_OLC_West_Metro_3DEP_2019_034962/20200715/other"

        },
        clipandShip: {
            //Test
            /* client: "Insite Automation (Test)",
            clientAlias: "insiteautomation-test",
            baseUrl: "https://discover-test.nv5geospatial.com",
            apiReqLogin : "https://discoverv2-test.nv5geospatial.com/auth/login",
            apiReqUsrProfile : "https://discoverv2-test.nv5geospatial.com/api/current_user", */

            //Staging
            client: "Insite Automation (Staging)",
            clientAlias: "insiteautomation-staging",            
            baseUrl: "https://discover-staging.nv5geospatial.com",
            apiReqLogin : "https://staging.api.discover.nv5geospatial.com/auth/login",
            apiReqUsrProfile : "https://staging.api.discover.nv5geospatial.com/api/current_user",

            //Common
            adminEmailId: "gayatriis9562@gmail.com",
            adminpassword: "P@ssword001",
            regularUserEmailId: "gayatriis9505@gmail.com",
            regularUserpassword: "P@ssword001",
            userGrp4Authorize: "TestGroup",
            userGroup: "CoreModules",
            newTdsName: "TestAutomatedTds",
            sourceTileIndex: "EDP_Scarlet_Solar_R037804/EDP_SCARLET_SOLAR_DELIVERABLES/01_Vector_Deliverables/03_Tile_Scheme/EDP_SCARLET_SOLAR_TILE_SCHEME_CASP_4_26944.shp/EDP_SCARLET_SOLAR_TILE_SCHEME_CASP_4_26944,Polygon,EPSG:26944",
            sourcefolderTiles: "EDP_Scarlet_Solar_R037804/EDP_SCARLET_SOLAR_DELIVERABLES/03_LiDAR_Deliverables",
            tileNameField: "TxtMemo",
            existingTds: "TdsforUpdate",
            //0th to update and 1st to revert
            tileIndexforUpdate: 
            ["Sempra_2021_29578/02_2021_06_09/04_Imagery_Index/Sempra_2021_Imperial_Tile_Index_NAD83_UTM11_m.shp/Sempra_2021_Imperial_Tile_Index_NAD83_UTM11_m,Polygon,EPSG:6340",
            "Sempra_2021_29578/02_2021_06_09/04_Imagery_Index/Sempra_2021_Monterey_Tile_Index_NAD83_UTM11_m.shp/Sempra_2021_Monterey_Tile_Index_NAD83_UTM11_m,Polygon,EPSG:6340"],
            //Edit 0th element and compare with 1st
            editTds: ["Imperial Imagery","West Metro Medium Res Lidar"],
            errorHandlingTds: "ErrHandling for Automation",
            errorHandlingSourceTileIndex: "Willamette_River_Topobathy_Lidar/Delivery_1/Vector/Indices/Willamette_River_Topobathy_Tile_Indices.gdb.zip/Willamette_River_Topobathy_Lidar_Index,Polygon,EPSG:6339",
            errorHandlingSourceFolderTiles: "Willamette_River_Topobathy_Lidar/Delivery_1/Lidar",
            errorHandlingTdsTileName: "Tile_ID",
            notHappyTds: "NotHappyPath for Automation",
            notHappySourceTileIndex: "Willamette_River_Topobathy_Lidar/Delivery_1/Vector/Indices/Willamette_River_Topobathy_Tile_Indices.gdb.zip/Willamette_River_Topobathy_Lidar_Index,Polygon,EPSG:6339",
            notHappySourceFolderTiles: "Willamette_River_Topobathy_Lidar/Delivery_1/Raster",
            notHappyTdsTileName: "Tile_ID",
            filterPresetName:  "TestAutomatedFilterPreset"    

        },
        medialibrary:{
            //Test
            /* bulkupload_file : 'testBulkUpload.csv' */

            //Staging
            bulkupload_file : 'stagingBulkUpload.csv'
        }

    }

)